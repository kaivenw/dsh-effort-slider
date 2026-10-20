import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import {
  IconCheckOutlineRegular,
  IconChevronDownOutlineRegular,
  IconChevronLeftOutlineRegular,
  IconChevronRightOutlineRegular,
  IconCloseFillRegular,
  IconDataOutlineRegular,
  IconRefreshOutlineRegular,
  Input,
  MenuGroup,
  MenuSurface,
  StateDot,
  observeStickyMenuGroups,
  rankByName,
} from '@deepseek-ai/dsh-client-ui-primitives';
import s from './styles.js';

/** 弹层首次测量时的占位样式：固定在视口左上角但不可见，量到尺寸后再摆位。 */
const MEASURE_STYLE = { visibility: 'hidden', left: 0, top: 0 };

/** 拼 className 的小工具（本插件不引入 clsx）。 */
function cx() {
  let out = '';
  for (let i = 0; i < arguments.length; i++) {
    const part = arguments[i];
    if (part) out += (out === '' ? '' : ' ') + part;
  }
  return out;
}

/** 已知档位 id（DeepSeek 与 pi-ai 的词表）；命中时用本插件的中文字典，否则用目录自带描述。 */
const HINT_LEVEL_IDS = new Set(['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']);

/** 滑杆两端留出旋钮半径，让旋钮在 0/100% 时完整落在轨道内（与 CSS 里的 12px/24px 对应）。 */
const TRACK_INSET = 12;

/**
 * 每个档位的配色与流动速度：
 * - 普通档蓝色、档位越高色相越深；最高档紫蓝渐变（Codex 的 Ultra 样式）。
 * - 流动速度随档位加快：最低档 14s 一圈，最高档 5s 一圈（Off 没有填充，速度无观感）。
 */
function levelTheme(index, total) {
  const safeTotal = Math.max(total, 1);
  const isTop = safeTotal > 1 && index >= safeTotal - 1;
  const ratio = safeTotal <= 1 ? 0 : Math.max(0, Math.min(1, index / (safeTotal - 1)));
  if (isTop) {
    return {
      accent: '#7c5cff',
      fill: 'linear-gradient(96deg, #2f46d6 0%, #5b4cf0 32%, #8b5cf6 64%, #b06bff 100%)',
      glow: 'rgba(124, 92, 255, 0.42)',
      ring: 'rgba(124, 92, 255, 0.18)',
    };
  }
  const hue = 208 + Math.round(ratio * 16);
  return {
    accent: 'hsl(' + hue + ' 92% 52%)',
    fill: 'linear-gradient(96deg, hsl(' + hue + ' 92% 50%) 0%, hsl(' + (hue + 8) + ' 92% 58%) 100%)',
    glow: 'hsla(' + hue + ', 92%, 55%, 0.4)',
    ring: 'hsla(' + hue + ', 92%, 55%, 0.18)',
  };
}

/** 档位刻度点的水平位置：与滑杆两端 12px 的内缩区间保持一致。 */
function stopLeft(index, total) {
  const ratio = total <= 1 ? 1 : index / (total - 1);
  const percent = Math.round(ratio * 10000) / 100;
  const offset = Math.round((TRACK_INSET - ratio * 2 * TRACK_INSET) * 100) / 100;
  return offset >= 0
    ? 'calc(' + percent + '% + ' + offset + 'px)'
    : 'calc(' + percent + '% - ' + -offset + 'px)';
}

/** 提供方排序：DeepSeek 账号第一，DeepSeek 官方第二，其余保持目录顺序。 */
function providerRank(id) {
  if (id === 'deepseek-account') return 0;
  if (id === 'deepseek-official') return 1;
  return 2;
}

function orderModelProviders(groups) {
  return groups
    .map((group, index) => ({ group, index }))
    .sort((a, b) => providerRank(a.group.id) - providerRank(b.group.id) || a.index - b.index)
    .map((entry) => entry.group);
}

/** 标题区左侧的闪电（固定紫色，和 Codex 的推理强度弹层同一视觉标识）。 */
function BoltIcon() {
  return (
    <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M9.32 1.06c.32-.2.73.03.73.41v4.06h3.3c.4 0 .63.46.4.78l-6.9 9.42c-.26.35-.82.09-.72-.34l1.15-4.83H3.1c-.4 0-.63-.46-.4-.78l6.62-8.72Z"
      />
    </svg>
  );
}

/**
 * composer 的模型/推理强度座位（Codex 风格）。
 *
 * 触发按钮保持官方 ModelSelect 的外观（模型名 + 当前推理强度 + 箭头）；
 * 打开后是一张 Codex 式弹层：档位名 + 说明 + 模型切换行 + 可拖动的流动滑杆。
 *
 * props：
 * - locked：composer 当前是否锁定；
 * - available / directory / load / select：由注册时的 inject 提供（会话级模型目录）；
 * - t：本插件 locale 命名空间下的翻译函数；
 * - renderSlot：slot 渲染器提供的子 slot 渲染函数。
 */
export function EffortSeat({ locked, available, directory, load, select, t, renderSlot }) {
  const state = useSyncExternalStore(
    (onChange) => directory.subscribe(onChange),
    () => directory.getSnapshot(),
  );

  const [open, setOpen] = useState(false);
  const [pane, setPane] = useState('root');
  const [query, setQuery] = useState('');
  const [dragLevel, setDragLevel] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const [error, setError] = useState(null);
  const [selectionFocus, setSelectionFocus] = useState(false);

  const id = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const panelRef = useRef(null);
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const sheenRef = useRef(null);
  const speedTargetRef = useRef(1);
  const searchRef = useRef(null);
  const groupsRef = useRef(null);
  const draggingRef = useRef(false);
  const dragIndexRef = useRef(undefined);
  const dragRatioRef = useRef(0);

  const groups = useMemo(() => {
    const accountName = t('provider.account');
    return orderModelProviders(state.groups).map((group) => ({
      ...group,
      provider: {
        id: group.id,
        name: group.id === 'deepseek-account' ? accountName : group.name,
      },
    }));
  }, [state.groups, t]);

  const choices = useMemo(
    () =>
      groups.flatMap((group) =>
        group.models.map((model) => ({
          group,
          model,
          selection: {
            provider: group.id,
            model: model.id,
            ...(model.reasoning?.defaultEffort === undefined
              ? {}
              : { reasoningEffort: model.reasoning.defaultEffort }),
          },
        })),
      ),
    [groups],
  );

  const currentChoice =
    state.current === null
      ? undefined
      : choices.find(
          (choice) =>
            choice.selection.provider === state.current.provider &&
            choice.selection.model === state.current.model,
        );

  const reasoning = currentChoice?.model.reasoning;
  const efforts = useMemo(() => reasoning?.efforts ?? [], [reasoning]);
  const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
  const effortLabel =
    currentChoice === undefined
      ? undefined
      : reasoning === undefined
        ? state.retainedEffort
        : effectiveEffort === undefined
          ? t('effort.providerDefault')
          : (reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ??
            effectiveEffort);

  const baseIndex =
    effectiveEffort === undefined
      ? undefined
      : efforts.findIndex((level) => level.id === effectiveEffort);
  const previewIndex = dragLevel !== null ? dragLevel : baseIndex !== undefined && baseIndex >= 0 ? baseIndex : undefined;
  const shownLevel = previewIndex === undefined ? undefined : efforts[previewIndex];
  const displayLevelName =
    shownLevel?.name ?? effortLabel ?? t('effort.providerDefault');
  const displayHint =
    shownLevel === undefined
      ? reasoning === undefined
        ? t('hint.noReasoning')
        : undefined
      : HINT_LEVEL_IDS.has(shownLevel.id)
        ? t('hint.level.' + shownLevel.id)
        : shownLevel.description;

  const hasReasoning = reasoning !== undefined && efforts.length > 0;
  const busy = state.pending !== null;
  const waiting = currentChoice === undefined && state.status === 'loading';
  const modelLabel = waiting
    ? t('trigger.loading')
    : (currentChoice?.model.name ?? t('trigger.fallback'));
  const pendingEffortName =
    state.pending !== null &&
    state.current !== null &&
    state.pending.provider === state.current.provider &&
    state.pending.model === state.current.model &&
    state.pending.reasoningEffort !== undefined
      ? reasoning?.efforts.find((level) => level.id === state.pending.reasoningEffort)?.name ??
        state.pending.reasoningEffort
      : undefined;
  const triggerEffortLabel = pendingEffortName ?? effortLabel;

  const triggerTitle = triggerEffortLabel === undefined ? modelLabel : modelLabel + ' · ' + triggerEffortLabel;
  const triggerAria = waiting
    ? t('trigger.loading')
    : currentChoice === undefined
      ? t('trigger.selectAria')
      : triggerEffortLabel === undefined
        ? t('trigger.aria', { model: modelLabel })
        : t('trigger.ariaEffort', { model: modelLabel, effort: triggerEffortLabel });

  const defaultEffort = reasoning?.defaultEffort;
  const isDefault =
    reasoning === undefined
      ? true
      : defaultEffort === undefined
        ? effectiveEffort === undefined
        : effectiveEffort === defaultEffort;

  const showSearch = choices.length > 4;
  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          models: rankByName(group.models, showSearch ? query.trim() : ''),
        }))
        .filter((group) => group.models.length > 0),
    [groups, query, showSearch],
  );

  // 配色跟当前（或拖动预览中的）档位走。
  const themeIndex =
    previewIndex !== undefined && previewIndex >= 0
      ? previewIndex
      : baseIndex !== undefined && baseIndex >= 0
        ? baseIndex
        : Math.max(efforts.length - 1, 0);
  const theme = levelTheme(themeIndex, efforts.length);

  // Off 档没有背景色：轨道保持灰色，填充层宽度归零。
  const isOffLevel = efforts.length > 0 && efforts[0].id === 'off' && previewIndex === 0;

  // 滑杆显示比例：拖动中跟指针走；其余时候落在档位上。
  const sliderRatio =
    efforts.length <= 1
      ? 1
      : dragging
        ? dragRatioRef.current
        : previewIndex !== undefined && previewIndex >= 0
          ? previewIndex / (efforts.length - 1)
          : 0;

  /** 渲染模型名称扩展 slot（1017 角标等）；slot 缺席时退回目录名。 */
  const renderModelLabel = useCallback(
    (provider, model, placement, selected) => {
      let content = model.name;
      if (typeof renderSlot === 'function') {
        try {
          content = renderSlot(
            'conversation.input.model.label',
            { provider, model, placement, selected },
            { fallback: model.name },
          );
        } catch {
          content = model.name;
        }
      }
      return (
        <span data-provider-id={provider.id} data-model-id={model.id}>
          {content}
        </span>
      );
    },
    [renderSlot],
  );

  const close = useCallback((restoreFocus) => {
    setOpen(false);
    setPane('root');
    setQuery('');
    setError(null);
    setDragLevel(null);
    setDragging(false);
    draggingRef.current = false;
    dragIndexRef.current = undefined;
    if (restoreFocus) {
      queueMicrotask(() => {
        triggerRef.current?.focus?.();
      });
    }
  }, []);

  const show = useCallback(() => {
    setPane('root');
    setQuery('');
    setError(null);
    setOpen(true);
    if (typeof load === 'function') load();
  }, [load]);

  const reportFailure = useCallback(
    (outcome) => {
      if (outcome === undefined || outcome === null || outcome.ok !== false) return;
      const failure = outcome.error;
      const code = failure?.code;
      const detail = code === 'session/writer-held'
        ? t('error.sessionInUse')
        : t('error.action', { message: (code ?? '') + ': ' + (failure?.message ?? '') });
      setError(detail);
      setDragLevel(null);
    },
    [t],
  );

  /** 提交一次模型/推理强度选择；返回是否成功。 */
  const runSelection = useCallback(
    (selection) => {
      setError(null);
      let result;
      try {
        result = select(selection);
      } catch (thrown) {
        setError(String(thrown?.message ?? thrown));
        setDragLevel(null);
        return Promise.resolve(false);
      }
      return Promise.resolve(result)
        .then((outcome) => {
          if (outcome !== undefined && outcome !== null && outcome.ok === false) {
            reportFailure(outcome);
            return false;
          }
          return true;
        })
        .catch((thrown) => {
          setError(String(thrown?.message ?? thrown));
          setDragLevel(null);
          return false;
        });
    },
    [select, reportFailure],
  );

  const commitEffort = useCallback(
    (effort) => {
      if (state.current === null || busy) return Promise.resolve(false);
      const selection = { provider: state.current.provider, model: state.current.model };
      if (effort !== undefined) selection.reasoningEffort = effort;
      return runSelection(selection);
    },
    [state.current, busy, runSelection],
  );

  const resetEffort = useCallback(() => {
    if (state.current === null || busy || isDefault) return;
    commitEffort(defaultEffort);
  }, [state.current, busy, isDefault, defaultEffort, commitEffort]);

  const chooseModel = useCallback(
    (provider, model) => {
      if (busy) return;
      if (state.current !== null && state.current.provider === provider && state.current.model === model) {
        close(true);
        return;
      }
      runSelection({ provider, model }).then((ok) => {
        if (ok) close(true);
      });
    },
    [busy, state.current, runSelection, close],
  );

  const ratioFromX = useCallback((clientX) => {
    const track = trackRef.current;
    if (track === null) return undefined;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 2 * TRACK_INSET) return undefined;
    return Math.min(1, Math.max(0, (clientX - rect.left - TRACK_INSET) / (rect.width - 2 * TRACK_INSET)));
  }, []);

  /** 拖动帧：滑杆直接跟随指针；只在跨过档位边界时更新一次档位文字。 */
  const trackPointer = useCallback(
    (clientX) => {
      const track = trackRef.current;
      const ratio = ratioFromX(clientX);
      if (track === null || ratio === undefined) return;
      dragRatioRef.current = ratio;
      track.style.setProperty('--dse-ratio', String(ratio));
      const index = efforts.length <= 1 ? 0 : Math.round(ratio * (efforts.length - 1));
      if (index !== dragIndexRef.current) {
        dragIndexRef.current = index;
        setDragLevel(index);
      }
    },
    [ratioFromX, efforts.length],
  );

  /** 松手：打开过渡后吸附到最近档位，再提交选择；不是硬跳到档位。 */
  const finishDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const track = trackRef.current;
    const index = dragIndexRef.current;
    dragIndexRef.current = undefined;
    if (track !== null) {
      track.classList.remove(s.dragging);
      if (index !== undefined && efforts.length > 1) {
        track.style.setProperty('--dse-ratio', String(index / (efforts.length - 1)));
      }
    }
    setDragging(false);
    if (index === undefined) {
      setDragLevel(null);
      return;
    }
    const level = efforts[index];
    if (level === undefined) {
      setDragLevel(null);
      return;
    }
    setDragLevel(index);
    if (level.id === effectiveEffort) {
      setDragLevel(null);
      return;
    }
    commitEffort(level.id);
  }, [efforts, effectiveEffort, commitEffort]);

  const onTrackPointerDown = useCallback(
    (event) => {
      if (locked || busy || efforts.length === 0) return;
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      const track = trackRef.current;
      if (track === null) return;
      draggingRef.current = true;
      // 先同步加上“拖动中”类名再写比例：否则第一帧会带着过渡从旧档位缓动到指针处。
      track.classList.add(s.dragging);
      setDragging(true);
      trackPointer(event.clientX);
      if (typeof track.setPointerCapture === 'function') {
        try {
          track.setPointerCapture(event.pointerId);
        } catch {
          /* 指针已释放时忽略 */
        }
      }
    },
    [locked, busy, efforts.length, trackPointer],
  );

  const onTrackPointerMove = useCallback(
    (event) => {
      if (!draggingRef.current) return;
      trackPointer(event.clientX);
    },
    [trackPointer],
  );

  const releaseCapture = useCallback((pointerId) => {
    const track = trackRef.current;
    if (track !== null && typeof track.releasePointerCapture === 'function') {
      try {
        track.releasePointerCapture(pointerId);
      } catch {
        /* 已释放时忽略 */
      }
    }
  }, []);

  const onTrackPointerUp = useCallback(
    (event) => {
      releaseCapture(event.pointerId);
      finishDrag();
    },
    [releaseCapture, finishDrag],
  );

  const onTrackPointerCancel = useCallback(
    (event) => {
      releaseCapture(event.pointerId);
      draggingRef.current = false;
      dragIndexRef.current = undefined;
      const track = trackRef.current;
      if (track !== null) {
        track.classList.remove(s.dragging);
        const base =
          efforts.length <= 1
            ? 1
            : previewIndex !== undefined && previewIndex >= 0
              ? previewIndex / (efforts.length - 1)
              : 0;
        track.style.setProperty('--dse-ratio', String(base));
      }
      setDragging(false);
      setDragLevel(null);
    },
    [releaseCapture, efforts.length, previewIndex],
  );

  const onLostPointerCapture = useCallback(() => {
    if (draggingRef.current) finishDrag();
  }, [finishDrag]);

  const onPanelKeyDown = useCallback(
    (event) => {
      if (event.nativeEvent?.isComposing) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (pane === 'model') {
          setPane('root');
          setQuery('');
        } else {
          close(true);
        }
        return;
      }
      if (pane !== 'root' || locked || busy || efforts.length === 0) return;
      if (!hasReasoning) return;
      const current = baseIndex === undefined || baseIndex < 0 ? 0 : baseIndex;
      let next;
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          next = Math.max(0, current - 1);
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          next = Math.min(efforts.length - 1, current + 1);
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = efforts.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      const level = efforts[next];
      if (level === undefined) return;
      dragIndexRef.current = next;
      setDragLevel(next);
      if (level.id !== effectiveEffort) {
        commitEffort(level.id);
      } else {
        setDragLevel(null);
      }
    },
    [pane, locked, busy, efforts, hasReasoning, baseIndex, effectiveEffort, commitEffort, close],
  );

  // 点击弹层与触发按钮之外的区域关闭。
  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (event) => {
      const target = event.target;
      if (rootRef.current !== null && rootRef.current.contains(target)) return;
      if (menuRef.current !== null && menuRef.current.contains(target)) return;
      close(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open, close]);

  // 弹层摆位：以触发按钮为中心放在其上方，越界时夹回视口。
  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null);
      return undefined;
    }
    const place = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect === undefined) return;
      const MARGIN = 12;
      const width = menuRef.current?.offsetWidth ?? 0;
      const height = menuRef.current?.offsetHeight ?? 0;
      let x = rect.left + rect.width / 2 - width / 2;
      let y = rect.top - 8 - height;
      if (width > 0) x = Math.min(Math.max(x, MARGIN), window.innerWidth - width - MARGIN);
      if (height > 0) y = Math.min(Math.max(y, MARGIN), window.innerHeight - height - MARGIN);
      setMenuPos({ left: x, top: y });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    const menu = menuRef.current;
    const observer =
      typeof ResizeObserver !== 'undefined' && menu !== null ? new ResizeObserver(place) : null;
    if (menu !== null && observer !== null) observer.observe(menu);
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, pane, state, query, efforts.length]);

  // 打开时把键盘焦点交给弹层（面板自身或模型搜索框），Escape/方向键才接得住。
  useLayoutEffect(() => {
    if (!open) return;
    if (pane === 'model' && showSearch) {
      searchRef.current?.focus?.();
      return;
    }
    panelRef.current?.focus?.();
  }, [open, pane, showSearch]);

  // 模型列表分组吸顶（与官方菜单同一套行为）。
  useEffect(() => {
    const viewport = groupsRef.current;
    if (viewport === null) return undefined;
    return observeStickyMenuGroups(viewport);
  }, [open, pane, filteredGroups]);

  // 选择落地后撤掉拖动预览，让头部回到真实值。
  useEffect(() => {
    if (dragLevel === null) return;
    if (state.pending !== null) return;
    const level = efforts[dragLevel];
    if (level === undefined || level.id === effectiveEffort) setDragLevel(null);
  }, [state.pending, state.current, efforts, effectiveEffort, dragLevel]);

  // 把显示比例同步到滑杆的 CSS 变量；拖动帧由指针处理函数直接写，这里兜住键盘、吸附与选择落地。
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track === null) return;
    track.style.setProperty('--dse-ratio', String(sliderRatio));
  });


  // 档位速度：气泡流的整体系数写进 ref（粒子循环自己缓动），扫光层改 playbackRate（相位连续）。
  // 260ms 缓动避免档位边界上速度突变被感知成顿挫。
  useEffect(() => {
    const ratio = efforts.length <= 1 ? 0 : Math.max(0, Math.min(1, themeIndex / (efforts.length - 1)));
    speedTargetRef.current = 14 / (14 - 9 * ratio);
    if (!open) return undefined;
    const sheenTarget = 14 / (6.5 - 2.8 * ratio);
    const animations = [];
    const sheen = sheenRef.current;
    if (sheen !== null) {
      for (const animation of sheen.getAnimations()) {
        if (animation.animationName === 'dse-sheen') {
          animations.push({ animation, from: animation.playbackRate, to: sheenTarget });
        }
      }
    }
    if (animations.length === 0) return undefined;
    const startedAt = performance.now();
    const RAMP_MS = 260;
    let frame = 0;
    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / RAMP_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      for (const item of animations) {
        item.animation.playbackRate = item.from + (item.to - item.from) * eased;
      }
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [open, themeIndex, efforts.length]);

  // 水流气泡：canvas 粒子。每颗泡泡有自己的半径、速度、上浮速度、横向摆动与闪烁相位，
  // 不会像平铺贴图那样露出固定形状；整条水流速度随档位变化（speedTargetRef），循环里平滑加速。
  useEffect(() => {
    if (!open) return undefined;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (canvas === null || track === null) return undefined;
    const context = canvas.getContext('2d');
    if (context === null) return undefined;
    const reduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TAU = Math.PI * 2;
    let seed = 20261020;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    let width = 0;
    let height = 0;
    let bubbles = [];
    const spawn = (initial) => {
      // 点状星点的半径：大多数是细点，偶尔一颗稍大，大小不均才不像平铺贴图
      const radius = random() < 0.12 ? 1.8 + random() * 0.7 : 0.55 + random() * 1.15;
      const depth = random();
      return {
        x: initial ? random() * width : -radius * 2 - random() * 12,
        y: 4 + random() * Math.max(1, height - 8),
        radius,
        speed: 16 + random() * 24 + depth * 12,
        rise: 1.1 + random() * 3,
        wobble: 0.6 + random() * 2,
        wobbleSpeed: 0.6 + random() * 1.5,
        phase: random() * TAU,
        alpha: 0.28 + random() * 0.6,
        twinkleSpeed: 0.8 + random() * 1.8,
        twinklePhase: random() * TAU,
      };
    };
    const resize = () => {
      // 用布局尺寸而不是 getBoundingClientRect：弹层入场动画带 transform，会让前者偏小。
      width = Math.max(1, track.offsetWidth);
      height = Math.max(1, track.offsetHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (bubbles.length === 0) {
        const count = Math.max(16, Math.min(44, Math.round(width / 7)));
        bubbles = Array.from({ length: count }, () => spawn(true));
      } else {
        for (const bubble of bubbles) {
          bubble.x = Math.min(bubble.x, width + bubble.radius);
          bubble.y = Math.min(Math.max(bubble.y, 3 + bubble.radius), height - 3 - bubble.radius);
        }
      }
    };
    resize();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(track);
    let factor = speedTargetRef.current;
    let last = performance.now();
    let elapsed = 0;
    let framesSinceProbe = 0;
    let frame = 0;
    const draw = (timestamp) => {
      const dt = Math.min(0.05, Math.max(0, (timestamp - last) / 1000));
      last = timestamp;
      elapsed += dt;
      factor += (speedTargetRef.current - factor) * Math.min(1, dt * 5);
      framesSinceProbe += 1;
      if (framesSinceProbe >= 10) {
        framesSinceProbe = 0;
        canvas.dataset.flowSpeed = factor.toFixed(2);
      }
      context.clearRect(0, 0, width, height);
      // 水光：两团很淡的大光斑以不同速度横向漂移
      for (let index = 0; index < 2; index++) {
        const speed = (0.16 + index * 0.1) * factor;
        const size = width * (0.7 + index * 0.25);
        const center = ((elapsed * width * speed + width * (0.25 + index * 0.35)) % (width + size)) - size / 2;
        const gradient = context.createRadialGradient(center, height / 2, 0, center, height / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + (index === 0 ? 0.12 : 0.08) + ')');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }
      for (const bubble of bubbles) {
        // 水往右流：整体右移 + 缓慢上浮 + 横向摆动，出界后从左侧重新冒出来
        bubble.x += bubble.speed * factor * dt;
        bubble.y -= bubble.rise * dt;
        if (bubble.y < 3) bubble.y = height - 3;
        if (bubble.x - bubble.radius > width) {
          Object.assign(bubble, spawn(false));
          continue;
        }
        const drawY = bubble.y + Math.sin(elapsed * bubble.wobbleSpeed + bubble.phase) * bubble.wobble;
        const twinkle = 0.7 + 0.3 * Math.sin(elapsed * bubble.twinkleSpeed + bubble.twinklePhase);
        const alpha = bubble.alpha * twinkle;
        // 点状星点（不是空心泡泡）：实心圆 + 稍大一颗的柔光晕
        context.beginPath();
        context.arc(bubble.x, drawY, bubble.radius, 0, TAU);
        context.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.88).toFixed(3) + ')';
        context.fill();
        if (bubble.radius > 1.25) {
          const halo = context.createRadialGradient(
            bubble.x,
            drawY,
            bubble.radius * 0.5,
            bubble.x,
            drawY,
            bubble.radius * 2.1,
          );
          halo.addColorStop(0, 'rgba(255, 255, 255, ' + (alpha * 0.22).toFixed(3) + ')');
          halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
          context.fillStyle = halo;
          context.beginPath();
          context.arc(bubble.x, drawY, bubble.radius * 2.1, 0, TAU);
          context.fill();
        }
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [open]);

  if (!available) return null;

  const slider =
    hasReasoning ? (
      <div className={s.slider}>
        <div
          ref={trackRef}
          className={cx(s.track, dragging && s.dragging)}
          data-off={isOffLevel ? '' : undefined}
          title={displayHint ?? t('slider.hint')}
          aria-description={displayHint ?? undefined}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={onTrackPointerUp}
          onPointerCancel={onTrackPointerCancel}
          onLostPointerCapture={onLostPointerCapture}
        >
          <div className={s.trackBase} />
          <div className={s.ticks} aria-hidden="true">
            {efforts.map((level, index) => (
              <span
                key={level.id}
                className={s.tick}
                style={{ left: stopLeft(index, efforts.length) }}
              />
            ))}
          </div>
          <div className={s.fill} />
          <div className={s.flow}>
            <canvas ref={canvasRef} className={s.bubbles} aria-hidden="true" />
            <div ref={sheenRef} className={s.sheen} />
          </div>
          <div
            className={s.knob}
            role="slider"
            tabIndex={0}
            aria-label={t('slider.aria')}
            aria-valuemin={0}
            aria-valuemax={efforts.length - 1}
            aria-valuenow={previewIndex === undefined ? 0 : previewIndex}
            aria-valuetext={displayLevelName}
            aria-description={displayHint ?? undefined}
            aria-disabled={locked || busy}
          />
        </div>
      </div>
    ) : (
      <div className={s.sliderHint}>{t('hint.noReasoning')}</div>
    );

  const rootPane = (
    <>
      <div className={s.header}>
        <span className={s.bolt}>
          <BoltIcon />
        </span>
        <div className={s.headings}>
          <div className={s.levelName}>{displayLevelName}</div>
        </div>
        {reasoning !== undefined ? (
          <button
            type="button"
            className={s.reset}
            aria-label={t('action.reset')}
            title={t('action.reset')}
            disabled={locked || busy || isDefault}
            onClick={resetEffort}
          >
            <IconRefreshOutlineRegular size={16} />
          </button>
        ) : (
          <span />
        )}
      </div>
      <button
        type="button"
        className={s.modelRow}
        disabled={locked || busy}
        aria-label={t('menu.model')}
        onClick={() => {
          setPane('model');
          setQuery('');
        }}
      >
        <span className={s.modelRowName}>
          {currentChoice === undefined
            ? modelLabel
            : renderModelLabel(currentChoice.group.provider, currentChoice.model, 'menu', true)}
        </span>
        <IconChevronRightOutlineRegular className={s.modelRowChevron} />
      </button>
      {slider}
      {error !== null ? (
        <div className={s.error}>
          <span>{error}</span>
        </div>
      ) : null}
    </>
  );

  const modelPane = (
    <>
      <div className={s.modelHeader}>
        <button
          type="button"
          className={s.back}
          aria-label={t('action.back')}
          onClick={() => {
            setPane('root');
            setQuery('');
          }}
        >
          <IconChevronLeftOutlineRegular />
        </button>
        <span className={s.modelTitle}>{t('menu.model')}</span>
      </div>
      {showSearch ? (
        <div className={s.searchRow}>
          <Input
            ref={searchRef}
            className={cx(s.search, query !== '' && s.searchWithQuery)}
            type="text"
            role="searchbox"
            aria-label={t('search.placeholder')}
            placeholder={t('search.placeholder')}
            value={query}
            readOnly={busy}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query !== '' ? (
            <button
              type="button"
              className={s.searchClear}
              aria-label={t('search.clear')}
              disabled={busy}
              onClick={() => {
                setQuery('');
                searchRef.current?.focus?.();
              }}
            >
              <IconCloseFillRegular />
            </button>
          ) : null}
        </div>
      ) : null}
      {state.status === 'loading' ? <div className={s.status}>{t('status.loading')}</div> : null}
      {state.error !== null ? (
        <div className={s.error}>
          <span>{t('error.action', { message: state.error })}</span>
          <button type="button" className={s.retry} onClick={() => load?.()}>
            {t('action.retry')}
          </button>
        </div>
      ) : null}
      {state.failures.map((failure) => (
        <div key={failure.id} className={s.warning}>
          <span>
            {t('warning.groupLoad', {
              name: failure.id === 'deepseek-account' ? t('provider.account') : failure.name,
              message: failure.message,
            })}
          </span>
          <button type="button" className={s.retry} onClick={() => load?.()}>
            {t('action.retry')}
          </button>
        </div>
      ))}
      <div
        ref={groupsRef}
        className={cx(s.groups, 'scrollable')}
        role="menu"
        aria-label={t('menu.model')}
        hidden={filteredGroups.length === 0}
      >
        {filteredGroups.map((group) => (
          <MenuGroup key={group.id} label={group.provider.name}>
            {group.models.map((model) => {
              const selected =
                state.current !== null &&
                state.current.provider === group.id &&
                state.current.model === model.id;
              const pendingThis =
                state.pending !== null &&
                state.pending.provider === group.id &&
                state.pending.model === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  title={model.name}
                  className={s.option}
                  disabled={busy}
                  onClick={() => chooseModel(group.id, model.id)}
                >
                  <span className={s.optionCopy}>
                    <span className={s.modelName}>
                      {renderModelLabel(group.provider, model, 'option', selected)}
                    </span>
                  </span>
                  <span className={s.check}>
                    {pendingThis ? (
                      <StateDot state="ongoing" />
                    ) : selected ? (
                      <IconCheckOutlineRegular />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </MenuGroup>
        ))}
      </div>
      {state.status === 'ready' && filteredGroups.length === 0 ? (
        <div className={s.empty} role="status">
          {t(choices.length === 0 ? 'empty.models' : 'search.empty')}
        </div>
      ) : null}
      {error !== null ? (
        <div className={s.error}>
          <span>{error}</span>
        </div>
      ) : null}
    </>
  );

  return (
    <div ref={rootRef} className={s.root} onMouseDown={(event) => {
      if (event.target instanceof Element && event.target.closest('button') !== null) {
        event.preventDefault();
      }
    }}>
      <button
        ref={triggerRef}
        type="button"
        className={s.trigger}
        aria-label={triggerAria}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id + '-menu' : undefined}
        title={triggerTitle}
        aria-busy={busy}
        data-selection-focus={selectionFocus ? '' : undefined}
        onBlur={() => setSelectionFocus(false)}
        disabled={locked}
        onClick={() => {
          if (open) {
            close(true);
          } else {
            setSelectionFocus(false);
            triggerRef.current?.focus?.();
            show();
          }
        }}
      >
        <IconDataOutlineRegular className={s.triggerIcon} size={16} />
        <span className={s.triggerLabel}>
          {currentChoice === undefined
            ? modelLabel
            : renderModelLabel(currentChoice.group.provider, currentChoice.model, 'trigger', true)}
        </span>
        {triggerEffortLabel !== undefined ? (
          <span className={s.triggerEffort}>{triggerEffortLabel}</span>
        ) : null}
        {busy ? (
          <StateDot state="ongoing" />
        ) : (
          <IconChevronDownOutlineRegular className={cx(s.chevron, open && s.chevronOpen)} />
        )}
      </button>
      {open
        ? createPortal(
            <MenuSurface
              ref={menuRef}
              id={id + '-menu'}
              className={s.popover}
              style={{
                ...(menuPos ?? MEASURE_STYLE),
                '--dse-accent': theme.accent,
                '--dse-fill': theme.fill,
                '--dse-glow': theme.glow,
                '--dse-ring': theme.ring,
              }}
              role="dialog"
              aria-label={t('popover.aria')}
              aria-busy={state.status === 'loading' || busy}
            >
              <div ref={panelRef} className={s.panel} tabIndex={-1} onKeyDown={onPanelKeyDown}>
                {pane === 'root' ? rootPane : modelPane}
              </div>
            </MenuSurface>,
            document.body,
          )
        : null}
    </div>
  );
}