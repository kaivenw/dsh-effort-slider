// Generated from src/client by `node scripts/build-client.mjs`. Do not edit by hand.
window.__ModuleLoader__.load({
  id: '@local/dsh-effort-slider',
  factory: (require) => {
const module = { exports: {} }
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.jsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/client/styles.css
var styles_default = "/*\n * dsh-effort-slider 的样式。\n * 触发按钮的规则照搬官方 ui-model-selection 的 composer seat 样式（本插件在同一个 slot 里\n * 以更低优先级遮蔽官方座位），弹层与滑杆是本插件自己的。\n * 颜色一律走 DSH 主题 token；滑杆的紫蓝渐变是 Codex 那套交互的视觉标识，深浅主题下都成立。\n */\n\n.dse-root {\n  min-width: 0;\n  position: relative;\n}\n\n/* ---------- composer 座位（与官方 ModelSelect 触发按钮同款） ---------- */\n\n.dse-trigger {\n  border-radius: var(--dsw-radius-sm);\n  min-width: 0;\n  max-width: min(360px, 45cqw);\n  height: 28px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  background: 0 0;\n  border: none;\n  outline: none;\n  align-items: center;\n  gap: 4px;\n  padding: 0 4px 0 8px;\n  font-size: 13px;\n  font-weight: 400;\n  line-height: 20px;\n  display: flex;\n}\n.dse-trigger:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.dse-trigger:focus-visible:not([data-selection-focus]) {\n  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n}\n.dse-trigger:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n.dse-triggerLabel {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n.dse-triggerEffort {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  color: var(--dsw-alias-label-caption);\n  flex-shrink: 1000;\n  overflow: hidden;\n}\n.dse-triggerIcon {\n  display: var(--dsh-composer-model-icon-display, none);\n  flex: none;\n}\n.dse-triggerLabel,\n.dse-triggerEffort {\n  display: var(--dsh-composer-model-text-display, block);\n}\n.dse-chevron {\n  color: var(--dsw-alias-label-caption);\n  flex: none;\n  transition: transform 0.12s;\n}\n.dse-chevronOpen {\n  transform: rotate(180deg);\n}\n\n/* ---------- 弹层（浮在 composer 上方） ---------- */\n\n.dse-popover {\n  position: fixed;\n  z-index: 1200;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  width: 300px;\n  max-width: calc(100vw - 24px);\n  padding: 12px 14px 10px;\n  border: 0;\n  border-radius: 14px;\n  animation: dse-enter 0.16s cubic-bezier(0.22, 0.61, 0.36, 1);\n  color: var(--dsw-alias-label-primary);\n  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n  box-shadow: var(--dsw-elevation-prominent);\n  overflow: hidden;\n}\n.dse-panel {\n  outline: none;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n}\n\n/* ---------- 标题区：闪电 / 档位名 + 说明 + 模型名 / 重置 ---------- */\n\n.dse-header {\n  display: grid;\n  grid-template-columns: 24px minmax(0, 1fr) 24px;\n  align-items: center;\n  column-gap: 4px;\n}\n.dse-bolt {\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  color: var(--dse-accent, #7c5cff);\n  transition: color 0.16s;\n}\n.dse-bolt svg {\n  width: 15px;\n  height: 15px;\n}\n.dse-headings {\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1px;\n  text-align: center;\n}\n.dse-levelName {\n  min-width: 0;\n  max-width: 100%;\n  font-size: 15px;\n  font-weight: 500;\n  line-height: 22px;\n  color: var(--dse-accent, var(--dsw-alias-label-primary));\n  transition: color 0.16s;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dse-reset {\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border: none;\n  border-radius: 50%;\n  background: 0 0;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  outline: none;\n}\n.dse-reset:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.dse-reset:focus-visible {\n  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n}\n.dse-reset:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n  opacity: 0.55;\n}\n\n.dse-modelRow {\n  margin: 3px auto 0;\n  max-width: 100%;\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  padding: 1px 6px;\n  border: none;\n  border-radius: 999px;\n  background: 0 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11.5px;\n  line-height: 16px;\n  cursor: pointer;\n  outline: none;\n}\n.dse-modelRow:hover:not(:disabled) {\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.dse-modelRow:focus-visible {\n  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n}\n.dse-modelRow:disabled {\n  cursor: default;\n  opacity: 0.6;\n}\n.dse-modelRowName {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dse-modelRowChevron {\n  flex: none;\n  width: 10px;\n  height: 10px;\n}\n\n/* ---------- 滑杆 ---------- */\n\n.dse-slider {\n  margin: 10px 2px 0;\n}\n.dse-track {\n  --dse-ratio: 0;\n  position: relative;\n  height: 26px;\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--dsw-alias-label-primary, #1c1e21) 8%, transparent);\n  cursor: pointer;\n  touch-action: none;\n  outline: none;\n}\n.dse-trackBase {\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background: linear-gradient(96deg, color-mix(in srgb, var(--dse-accent, #2f46d6) 10%, transparent), transparent 72%);\n}\n/* 档位刻度点：放在填充层下面，所以只露出当前档位之后的小点。 */\n.dse-ticks {\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.dse-tick {\n  position: absolute;\n  top: 50%;\n  width: 3.5px;\n  height: 3.5px;\n  margin-left: -1.75px;\n  border-radius: 50%;\n  transform: translateY(-50%);\n  background: var(--dsw-alias-label-tertiary, #8a8f98);\n  opacity: 0.6;\n}\n.dse-fill,\n.dse-flow {\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: calc(var(--dse-ratio) * 100% + 12px - var(--dse-ratio) * 24px);\n  border-radius: inherit;\n  pointer-events: none;\n}\n.dse-fill {\n  background: var(--dse-fill, linear-gradient(96deg, #2f46d6 0%, #5b4cf0 32%, #8b5cf6 64%, #b06bff 100%));\n  box-shadow: 0 0 14px var(--dse-glow, rgba(124, 92, 255, 0.42));\n  transition: width 0.16s cubic-bezier(0.22, 0.61, 0.36, 1);\n}\n.dse-flow {\n  overflow: hidden;\n  transition: width 0.16s cubic-bezier(0.22, 0.61, 0.36, 1);\n}\n/* 气泡层：canvas 粒子系统（逻辑在 seat.jsx），父级 overflow: hidden 把画面裁成填充区形状。\n   每颗泡泡的大小/速度/上浮/摆动/闪烁相位都不同，不会露出平铺贴图的固定图案。 */\n.dse-bubbles {\n  position: absolute;\n  left: 0;\n  top: 0;\n  display: block;\n  pointer-events: none;\n}\n/* 扫光层：匀速往返的斜向高光，基准 14s，档位速度同样由 playbackRate 控制。 */\n.dse-sheen {\n  position: absolute;\n  top: -20%;\n  bottom: -20%;\n  left: -80px;\n  width: 80px;\n  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.22) 50%, transparent 100%);\n  animation: dse-sheen 14s linear infinite;\n  will-change: transform;\n}\n.dse-track[data-off] .dse-fill,\n.dse-track[data-off] .dse-flow {\n  width: 0;\n}\n.dse-dragging .dse-fill,\n.dse-dragging .dse-flow,\n.dse-dragging .dse-knob {\n  transition: none;\n}\n.dse-knob {\n  position: absolute;\n  top: 50%;\n  left: calc(var(--dse-ratio) * 100% + 12px - var(--dse-ratio) * 24px);\n  width: 24px;\n  height: 24px;\n  margin-left: -12px;\n  transform: translateY(-50%);\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 1px 2px rgba(15, 20, 40, 0.24), 0 0 0 1px rgba(15, 20, 40, 0.07);\n  pointer-events: none;\n  transition: left 0.16s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.15s;\n  outline: none;\n}\n.dse-dragging .dse-knob {\n  box-shadow: 0 2px 6px rgba(15, 20, 40, 0.3), 0 0 0 1px rgba(15, 20, 40, 0.08), 0 0 0 6px var(--dse-ring, rgba(124, 92, 255, 0.18));\n}\n.dse-knob:focus-visible {\n  box-shadow: 0 2px 6px rgba(15, 20, 40, 0.3), 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n}\n.dse-sliderHint {\n  margin: 7px 2px 0;\n  min-height: 16px;\n  font-size: 11px;\n  line-height: 16px;\n  color: var(--dsw-alias-label-tertiary);\n  text-align: center;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* ---------- 错误 ---------- */\n\n.dse-error {\n  margin-top: 9px;\n  padding: 6px 8px;\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 11px;\n  line-height: 16px;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 6px;\n}\n.dse-retry {\n  flex: none;\n  border: none;\n  background: 0 0;\n  padding: 0;\n  color: inherit;\n  font: inherit;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n/* ---------- 模型列表（下钻面板） ---------- */\n\n.dse-modelHeader {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  margin: 0 0 6px;\n  min-height: 26px;\n}\n.dse-back {\n  display: grid;\n  place-items: center;\n  width: 26px;\n  height: 26px;\n  border: none;\n  border-radius: var(--dsw-radius-md);\n  background: 0 0;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  outline: none;\n}\n.dse-back:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.dse-back:focus-visible {\n  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n}\n.dse-modelTitle {\n  font-size: 13px;\n  line-height: 20px;\n  font-weight: 500;\n  color: var(--dsw-alias-label-primary);\n}\n.dse-searchRow {\n  position: relative;\n  flex-shrink: 0;\n  margin: 2px 0 3px;\n}\n.dse-searchRow .dse-search {\n  border-radius: var(--dsw-radius-md);\n  background: 0 0;\n  border: 0 solid transparent;\n  height: auto;\n  padding: 5px 7px;\n  display: flex;\n}\n.dse-searchRow .dse-searchWithQuery {\n  padding-right: 34px;\n}\n.dse-searchRow .dse-search:focus-within {\n  border-color: transparent;\n}\n.dse-searchRow .dse-search input {\n  padding: 0;\n  font-size: 12px;\n  line-height: normal;\n}\n.dse-searchRow .dse-search input::placeholder {\n  color: var(--dsw-alias-label-caption);\n}\n.dse-searchClear {\n  position: absolute;\n  top: 50%;\n  right: 4px;\n  transform: translateY(-50%);\n  width: 24px;\n  height: 24px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  border: none;\n  border-radius: 50%;\n  background: 0 0;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n.dse-searchClear:hover,\n.dse-searchClear:focus-visible {\n  background: var(--dsw-alias-interactive-bg-hover);\n  outline: none;\n}\n.dse-groups {\n  min-height: 0;\n  max-height: 320px;\n  overflow-y: auto;\n}\n.dse-option {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: auto;\n  min-width: 100%;\n  min-height: 34px;\n  padding: 5px 7px;\n  border: none;\n  border-radius: var(--dsw-radius-md);\n  background: 0 0;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  outline: none;\n}\n.dse-option:hover:not(:disabled),\n.dse-option:focus-visible {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.dse-option:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n.dse-optionCopy {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n}\n.dse-modelName {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 13px;\n  font-weight: 400;\n  line-height: 18px;\n  color: inherit;\n}\n.dse-check {\n  display: grid;\n  place-items: center;\n  flex: 0 0 14px;\n  color: var(--dsw-alias-label-primary);\n}\n.dse-check svg {\n  width: 14px;\n  height: 14px;\n}\n.dse-empty,\n.dse-status {\n  padding: 8px;\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.dse-warning {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 6px;\n  margin-bottom: 3px;\n  padding: 6px 7px;\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-state-warn-label);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n@keyframes dse-sheen {\n  from {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(520px);\n  }\n}\n@keyframes dse-enter {\n  from {\n    opacity: 0;\n    transform: translateY(4px) scale(0.97);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dse-sheen,\n  .dse-popover,\n  .dse-fill,\n  .dse-flow,\n  .dse-knob,\n  .dse-levelName,\n  .dse-bolt {\n    animation: none;\n    transition: none;\n  }\n}";

// src/client/dictionary.js
var zh = {
  "provider.account": "DeepSeek 账号",
  "trigger.fallback": "请选择模型",
  "trigger.loading": "正在加载模型…",
  "trigger.selectAria": "请选择模型",
  "trigger.aria": "选择模型，当前 {model}",
  "trigger.ariaEffort": "选择模型，当前 {model}，推理强度 {effort}",
  "popover.aria": "模型与推理强度",
  "menu.model": "模型",
  "menu.effort": "推理强度",
  "slider.aria": "推理强度",
  "slider.hint": "左右拖动切换推理强度",
  "effort.providerDefault": "Default",
  "action.reset": "重置为默认",
  "action.back": "返回",
  "action.retry": "重试",
  "status.loading": "正在刷新模型列表…",
  "error.action": "模型操作失败：{message}",
  "error.sessionInUse": "当前会话已被占用，可能是其他正在运行的 DSH 导致的（如其他 dsh web、桌面端），请退出其他正在运行的 DSH 后重试。",
  "warning.groupLoad": "{name} 加载失败：{message}",
  "search.placeholder": "搜索模型…",
  "search.clear": "清除搜索",
  "search.empty": "没有匹配的模型。",
  "empty.models": "暂无可用模型",
  "hint.noReasoning": "当前模型未提供推理强度档位",
  "hint.level.off": "用于不需要推理的简单任务",
  "hint.level.minimal": "尽量少思考，优先低延迟",
  "hint.level.low": "适合常规或对延迟敏感的任务",
  "hint.level.medium": "常规任务的均衡档",
  "hint.level.high": "大多数任务的默认均衡档",
  "hint.level.xhigh": "质量优先，思考更深",
  "hint.level.max": "留给最难、质量优先的任务"
};
var en = {
  "provider.account": "DeepSeek Account",
  "trigger.fallback": "Select model",
  "trigger.loading": "Loading models…",
  "trigger.selectAria": "Select model",
  "trigger.aria": "Select model, current {model}",
  "trigger.ariaEffort": "Select model, current {model}, reasoning effort {effort}",
  "popover.aria": "Model and reasoning effort",
  "menu.model": "Model",
  "menu.effort": "Effort",
  "slider.aria": "Reasoning effort",
  "slider.hint": "Drag left or right to change effort",
  "effort.providerDefault": "Default",
  "action.reset": "Reset to default",
  "action.back": "Back",
  "action.retry": "Retry",
  "status.loading": "Refreshing models…",
  "error.action": "Model operation failed: {message}",
  "error.sessionInUse": "This session is already in use, possibly by another running DSH instance (such as dsh web or the desktop app). Quit other running DSH instances and try again.",
  "warning.groupLoad": "{name} failed to load: {message}",
  "search.placeholder": "Search models…",
  "search.clear": "Clear search",
  "search.empty": "No matching models.",
  "empty.models": "No models available.",
  "hint.noReasoning": "This model provides no reasoning effort levels.",
  "hint.level.off": "Use for simple tasks that do not need reasoning",
  "hint.level.minimal": "Minimal thinking, favour low latency",
  "hint.level.low": "Prefer for routine or latency-sensitive tasks",
  "hint.level.medium": "A balanced level for everyday tasks",
  "hint.level.high": "The default balance for most tasks",
  "hint.level.xhigh": "Quality first, deeper thinking",
  "hint.level.max": "Reserve for the hardest quality-first tasks"
};

// src/client/install-styles.js
var TAG_ID = "@local/dsh-effort-slider/styles.css";
function installStyles(doc, css) {
  if (doc === void 0 || doc === null || typeof css !== "string") return;
  if (doc.querySelector("style[data-dsh-effort-slider]") !== null) return;
  const tag = doc.createElement("style");
  tag.dataset.dshEffortSlider = "";
  tag.dataset.plugin = "@local/dsh-effort-slider";
  tag.dataset.pluginCss = TAG_ID;
  tag.textContent = css;
  doc.head.appendChild(tag);
}

// src/client/seat.jsx
var import_react = require("react");
var import_react_dom = require("react-dom");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/styles.js
var classes = {
  root: "dse-root",
  trigger: "dse-trigger",
  triggerLabel: "dse-triggerLabel",
  triggerEffort: "dse-triggerEffort",
  triggerIcon: "dse-triggerIcon",
  chevron: "dse-chevron",
  chevronOpen: "dse-chevronOpen",
  popover: "dse-popover",
  panel: "dse-panel",
  header: "dse-header",
  bolt: "dse-bolt",
  headings: "dse-headings",
  levelName: "dse-levelName",
  levelHint: "dse-levelHint",
  reset: "dse-reset",
  modelRow: "dse-modelRow",
  modelRowName: "dse-modelRowName",
  modelRowChevron: "dse-modelRowChevron",
  slider: "dse-slider",
  track: "dse-track",
  trackBase: "dse-trackBase",
  ticks: "dse-ticks",
  tick: "dse-tick",
  fill: "dse-fill",
  flow: "dse-flow",
  bubbles: "dse-bubbles",
  sheen: "dse-sheen",
  knob: "dse-knob",
  dragging: "dse-dragging",
  sliderHint: "dse-sliderHint",
  error: "dse-error",
  retry: "dse-retry",
  modelHeader: "dse-modelHeader",
  back: "dse-back",
  modelTitle: "dse-modelTitle",
  searchRow: "dse-searchRow",
  search: "dse-search",
  searchWithQuery: "dse-searchWithQuery",
  searchClear: "dse-searchClear",
  groups: "dse-groups",
  option: "dse-option",
  optionCopy: "dse-optionCopy",
  modelName: "dse-modelName",
  check: "dse-check",
  empty: "dse-empty",
  status: "dse-status",
  warning: "dse-warning"
};
var styles_default2 = classes;

// src/client/seat.jsx
var import_jsx_runtime = require("react/jsx-runtime");
var MEASURE_STYLE = { visibility: "hidden", left: 0, top: 0 };
function cx() {
  let out = "";
  for (let i = 0; i < arguments.length; i++) {
    const part = arguments[i];
    if (part) out += (out === "" ? "" : " ") + part;
  }
  return out;
}
var HINT_LEVEL_IDS = /* @__PURE__ */ new Set(["off", "minimal", "low", "medium", "high", "xhigh", "max"]);
var TRACK_INSET = 12;
function levelTheme(index, total) {
  const safeTotal = Math.max(total, 1);
  const isTop = safeTotal > 1 && index >= safeTotal - 1;
  const ratio = safeTotal <= 1 ? 0 : Math.max(0, Math.min(1, index / (safeTotal - 1)));
  if (isTop) {
    return {
      accent: "#7c5cff",
      fill: "linear-gradient(96deg, #2f46d6 0%, #5b4cf0 32%, #8b5cf6 64%, #b06bff 100%)",
      glow: "rgba(124, 92, 255, 0.42)",
      ring: "rgba(124, 92, 255, 0.18)"
    };
  }
  const hue = 208 + Math.round(ratio * 16);
  return {
    accent: "hsl(" + hue + " 92% 52%)",
    fill: "linear-gradient(96deg, hsl(" + hue + " 92% 50%) 0%, hsl(" + (hue + 8) + " 92% 58%) 100%)",
    glow: "hsla(" + hue + ", 92%, 55%, 0.4)",
    ring: "hsla(" + hue + ", 92%, 55%, 0.18)"
  };
}
function stopLeft(index, total) {
  const ratio = total <= 1 ? 1 : index / (total - 1);
  const percent = Math.round(ratio * 1e4) / 100;
  const offset = Math.round((TRACK_INSET - ratio * 2 * TRACK_INSET) * 100) / 100;
  return offset >= 0 ? "calc(" + percent + "% + " + offset + "px)" : "calc(" + percent + "% - " + -offset + "px)";
}
function providerRank(id) {
  if (id === "deepseek-account") return 0;
  if (id === "deepseek-official") return 1;
  return 2;
}
function orderModelProviders(groups) {
  return groups.map((group, index) => ({ group, index })).sort((a, b) => providerRank(a.group.id) - providerRank(b.group.id) || a.index - b.index).map((entry) => entry.group);
}
function BoltIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { viewBox: "0 0 16 16", width: "17", height: "17", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      fill: "currentColor",
      d: "M9.32 1.06c.32-.2.73.03.73.41v4.06h3.3c.4 0 .63.46.4.78l-6.9 9.42c-.26.35-.82.09-.72-.34l1.15-4.83H3.1c-.4 0-.63-.46-.4-.78l6.62-8.72Z"
    }
  ) });
}
function EffortSeat({ locked, available, directory, load, select, t, renderSlot }) {
  const state = (0, import_react.useSyncExternalStore)(
    (onChange) => directory.subscribe(onChange),
    () => directory.getSnapshot()
  );
  const [open, setOpen] = (0, import_react.useState)(false);
  const [pane, setPane] = (0, import_react.useState)("root");
  const [query, setQuery] = (0, import_react.useState)("");
  const [dragLevel, setDragLevel] = (0, import_react.useState)(null);
  const [dragging, setDragging] = (0, import_react.useState)(false);
  const [menuPos, setMenuPos] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const [selectionFocus, setSelectionFocus] = (0, import_react.useState)(false);
  const id = (0, import_react.useId)();
  const rootRef = (0, import_react.useRef)(null);
  const triggerRef = (0, import_react.useRef)(null);
  const menuRef = (0, import_react.useRef)(null);
  const panelRef = (0, import_react.useRef)(null);
  const trackRef = (0, import_react.useRef)(null);
  const canvasRef = (0, import_react.useRef)(null);
  const sheenRef = (0, import_react.useRef)(null);
  const speedTargetRef = (0, import_react.useRef)(1);
  const searchRef = (0, import_react.useRef)(null);
  const groupsRef = (0, import_react.useRef)(null);
  const draggingRef = (0, import_react.useRef)(false);
  const dragIndexRef = (0, import_react.useRef)(void 0);
  const dragRatioRef = (0, import_react.useRef)(0);
  const groups = (0, import_react.useMemo)(() => {
    const accountName = t("provider.account");
    return orderModelProviders(state.groups).map((group) => ({
      ...group,
      provider: {
        id: group.id,
        name: group.id === "deepseek-account" ? accountName : group.name
      }
    }));
  }, [state.groups, t]);
  const choices = (0, import_react.useMemo)(
    () => groups.flatMap(
      (group) => group.models.map((model) => ({
        group,
        model,
        selection: {
          provider: group.id,
          model: model.id,
          ...model.reasoning?.defaultEffort === void 0 ? {} : { reasoningEffort: model.reasoning.defaultEffort }
        }
      }))
    ),
    [groups]
  );
  const currentChoice = state.current === null ? void 0 : choices.find(
    (choice) => choice.selection.provider === state.current.provider && choice.selection.model === state.current.model
  );
  const reasoning = currentChoice?.model.reasoning;
  const efforts = (0, import_react.useMemo)(() => reasoning?.efforts ?? [], [reasoning]);
  const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
  const effortLabel = currentChoice === void 0 ? void 0 : reasoning === void 0 ? state.retainedEffort : effectiveEffort === void 0 ? t("effort.providerDefault") : reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ?? effectiveEffort;
  const baseIndex = effectiveEffort === void 0 ? void 0 : efforts.findIndex((level) => level.id === effectiveEffort);
  const previewIndex = dragLevel !== null ? dragLevel : baseIndex !== void 0 && baseIndex >= 0 ? baseIndex : void 0;
  const shownLevel = previewIndex === void 0 ? void 0 : efforts[previewIndex];
  const displayLevelName = shownLevel?.name ?? effortLabel ?? t("effort.providerDefault");
  const displayHint = shownLevel === void 0 ? reasoning === void 0 ? t("hint.noReasoning") : void 0 : HINT_LEVEL_IDS.has(shownLevel.id) ? t("hint.level." + shownLevel.id) : shownLevel.description;
  const hasReasoning = reasoning !== void 0 && efforts.length > 0;
  const busy = state.pending !== null;
  const waiting = currentChoice === void 0 && state.status === "loading";
  const modelLabel = waiting ? t("trigger.loading") : currentChoice?.model.name ?? t("trigger.fallback");
  const pendingEffortName = state.pending !== null && state.current !== null && state.pending.provider === state.current.provider && state.pending.model === state.current.model && state.pending.reasoningEffort !== void 0 ? reasoning?.efforts.find((level) => level.id === state.pending.reasoningEffort)?.name ?? state.pending.reasoningEffort : void 0;
  const triggerEffortLabel = pendingEffortName ?? effortLabel;
  const triggerTitle = triggerEffortLabel === void 0 ? modelLabel : modelLabel + " · " + triggerEffortLabel;
  const triggerAria = waiting ? t("trigger.loading") : currentChoice === void 0 ? t("trigger.selectAria") : triggerEffortLabel === void 0 ? t("trigger.aria", { model: modelLabel }) : t("trigger.ariaEffort", { model: modelLabel, effort: triggerEffortLabel });
  const defaultEffort = reasoning?.defaultEffort;
  const isDefault = reasoning === void 0 ? true : defaultEffort === void 0 ? effectiveEffort === void 0 : effectiveEffort === defaultEffort;
  const showSearch = choices.length > 4;
  const filteredGroups = (0, import_react.useMemo)(
    () => groups.map((group) => ({
      ...group,
      models: (0, import_dsh_client_ui_primitives.rankByName)(group.models, showSearch ? query.trim() : "")
    })).filter((group) => group.models.length > 0),
    [groups, query, showSearch]
  );
  const themeIndex = previewIndex !== void 0 && previewIndex >= 0 ? previewIndex : baseIndex !== void 0 && baseIndex >= 0 ? baseIndex : Math.max(efforts.length - 1, 0);
  const theme = levelTheme(themeIndex, efforts.length);
  const isOffLevel = efforts.length > 0 && efforts[0].id === "off" && previewIndex === 0;
  const sliderRatio = efforts.length <= 1 ? 1 : dragging ? dragRatioRef.current : previewIndex !== void 0 && previewIndex >= 0 ? previewIndex / (efforts.length - 1) : 0;
  const renderModelLabel = (0, import_react.useCallback)(
    (provider, model, placement, selected) => {
      let content = model.name;
      if (typeof renderSlot === "function") {
        try {
          content = renderSlot(
            "conversation.input.model.label",
            { provider, model, placement, selected },
            { fallback: model.name }
          );
        } catch {
          content = model.name;
        }
      }
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "data-provider-id": provider.id, "data-model-id": model.id, children: content });
    },
    [renderSlot]
  );
  const close = (0, import_react.useCallback)((restoreFocus) => {
    setOpen(false);
    setPane("root");
    setQuery("");
    setError(null);
    setDragLevel(null);
    setDragging(false);
    draggingRef.current = false;
    dragIndexRef.current = void 0;
    if (restoreFocus) {
      queueMicrotask(() => {
        triggerRef.current?.focus?.();
      });
    }
  }, []);
  const show = (0, import_react.useCallback)(() => {
    setPane("root");
    setQuery("");
    setError(null);
    setOpen(true);
    if (typeof load === "function") load();
  }, [load]);
  const reportFailure = (0, import_react.useCallback)(
    (outcome) => {
      if (outcome === void 0 || outcome === null || outcome.ok !== false) return;
      const failure = outcome.error;
      const code = failure?.code;
      const detail = code === "session/writer-held" ? t("error.sessionInUse") : t("error.action", { message: (code ?? "") + ": " + (failure?.message ?? "") });
      setError(detail);
      setDragLevel(null);
    },
    [t]
  );
  const runSelection = (0, import_react.useCallback)(
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
      return Promise.resolve(result).then((outcome) => {
        if (outcome !== void 0 && outcome !== null && outcome.ok === false) {
          reportFailure(outcome);
          return false;
        }
        return true;
      }).catch((thrown) => {
        setError(String(thrown?.message ?? thrown));
        setDragLevel(null);
        return false;
      });
    },
    [select, reportFailure]
  );
  const commitEffort = (0, import_react.useCallback)(
    (effort) => {
      if (state.current === null || busy) return Promise.resolve(false);
      const selection = { provider: state.current.provider, model: state.current.model };
      if (effort !== void 0) selection.reasoningEffort = effort;
      return runSelection(selection);
    },
    [state.current, busy, runSelection]
  );
  const resetEffort = (0, import_react.useCallback)(() => {
    if (state.current === null || busy || isDefault) return;
    commitEffort(defaultEffort);
  }, [state.current, busy, isDefault, defaultEffort, commitEffort]);
  const chooseModel = (0, import_react.useCallback)(
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
    [busy, state.current, runSelection, close]
  );
  const ratioFromX = (0, import_react.useCallback)((clientX) => {
    const track = trackRef.current;
    if (track === null) return void 0;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 2 * TRACK_INSET) return void 0;
    return Math.min(1, Math.max(0, (clientX - rect.left - TRACK_INSET) / (rect.width - 2 * TRACK_INSET)));
  }, []);
  const trackPointer = (0, import_react.useCallback)(
    (clientX) => {
      const track = trackRef.current;
      const ratio = ratioFromX(clientX);
      if (track === null || ratio === void 0) return;
      dragRatioRef.current = ratio;
      track.style.setProperty("--dse-ratio", String(ratio));
      const index = efforts.length <= 1 ? 0 : Math.round(ratio * (efforts.length - 1));
      if (index !== dragIndexRef.current) {
        dragIndexRef.current = index;
        setDragLevel(index);
      }
    },
    [ratioFromX, efforts.length]
  );
  const finishDrag = (0, import_react.useCallback)(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const track = trackRef.current;
    const index = dragIndexRef.current;
    dragIndexRef.current = void 0;
    if (track !== null) {
      track.classList.remove(styles_default2.dragging);
      if (index !== void 0 && efforts.length > 1) {
        track.style.setProperty("--dse-ratio", String(index / (efforts.length - 1)));
      }
    }
    setDragging(false);
    if (index === void 0) {
      setDragLevel(null);
      return;
    }
    const level = efforts[index];
    if (level === void 0) {
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
  const onTrackPointerDown = (0, import_react.useCallback)(
    (event) => {
      if (locked || busy || efforts.length === 0) return;
      if (event.button !== void 0 && event.button !== 0) return;
      event.preventDefault();
      const track = trackRef.current;
      if (track === null) return;
      draggingRef.current = true;
      track.classList.add(styles_default2.dragging);
      setDragging(true);
      trackPointer(event.clientX);
      if (typeof track.setPointerCapture === "function") {
        try {
          track.setPointerCapture(event.pointerId);
        } catch {
        }
      }
    },
    [locked, busy, efforts.length, trackPointer]
  );
  const onTrackPointerMove = (0, import_react.useCallback)(
    (event) => {
      if (!draggingRef.current) return;
      trackPointer(event.clientX);
    },
    [trackPointer]
  );
  const releaseCapture = (0, import_react.useCallback)((pointerId) => {
    const track = trackRef.current;
    if (track !== null && typeof track.releasePointerCapture === "function") {
      try {
        track.releasePointerCapture(pointerId);
      } catch {
      }
    }
  }, []);
  const onTrackPointerUp = (0, import_react.useCallback)(
    (event) => {
      releaseCapture(event.pointerId);
      finishDrag();
    },
    [releaseCapture, finishDrag]
  );
  const onTrackPointerCancel = (0, import_react.useCallback)(
    (event) => {
      releaseCapture(event.pointerId);
      draggingRef.current = false;
      dragIndexRef.current = void 0;
      const track = trackRef.current;
      if (track !== null) {
        track.classList.remove(styles_default2.dragging);
        const base = efforts.length <= 1 ? 1 : previewIndex !== void 0 && previewIndex >= 0 ? previewIndex / (efforts.length - 1) : 0;
        track.style.setProperty("--dse-ratio", String(base));
      }
      setDragging(false);
      setDragLevel(null);
    },
    [releaseCapture, efforts.length, previewIndex]
  );
  const onLostPointerCapture = (0, import_react.useCallback)(() => {
    if (draggingRef.current) finishDrag();
  }, [finishDrag]);
  const onPanelKeyDown = (0, import_react.useCallback)(
    (event) => {
      if (event.nativeEvent?.isComposing) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (pane === "model") {
          setPane("root");
          setQuery("");
        } else {
          close(true);
        }
        return;
      }
      if (pane !== "root" || locked || busy || efforts.length === 0) return;
      if (!hasReasoning) return;
      const current = baseIndex === void 0 || baseIndex < 0 ? 0 : baseIndex;
      let next;
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowDown":
          next = Math.max(0, current - 1);
          break;
        case "ArrowRight":
        case "ArrowUp":
          next = Math.min(efforts.length - 1, current + 1);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = efforts.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      const level = efforts[next];
      if (level === void 0) return;
      dragIndexRef.current = next;
      setDragLevel(next);
      if (level.id !== effectiveEffort) {
        commitEffort(level.id);
      } else {
        setDragLevel(null);
      }
    },
    [pane, locked, busy, efforts, hasReasoning, baseIndex, effectiveEffort, commitEffort, close]
  );
  (0, import_react.useEffect)(() => {
    if (!open) return void 0;
    const onOutside = (event) => {
      const target = event.target;
      if (rootRef.current !== null && rootRef.current.contains(target)) return;
      if (menuRef.current !== null && menuRef.current.contains(target)) return;
      close(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open, close]);
  (0, import_react.useLayoutEffect)(() => {
    if (!open) {
      setMenuPos(null);
      return void 0;
    }
    const place = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect === void 0) return;
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
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    const menu = menuRef.current;
    const observer = typeof ResizeObserver !== "undefined" && menu !== null ? new ResizeObserver(place) : null;
    if (menu !== null && observer !== null) observer.observe(menu);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, pane, state, query, efforts.length]);
  (0, import_react.useLayoutEffect)(() => {
    if (!open) return;
    if (pane === "model" && showSearch) {
      searchRef.current?.focus?.();
      return;
    }
    panelRef.current?.focus?.();
  }, [open, pane, showSearch]);
  (0, import_react.useEffect)(() => {
    const viewport = groupsRef.current;
    if (viewport === null) return void 0;
    return (0, import_dsh_client_ui_primitives.observeStickyMenuGroups)(viewport);
  }, [open, pane, filteredGroups]);
  (0, import_react.useEffect)(() => {
    if (dragLevel === null) return;
    if (state.pending !== null) return;
    const level = efforts[dragLevel];
    if (level === void 0 || level.id === effectiveEffort) setDragLevel(null);
  }, [state.pending, state.current, efforts, effectiveEffort, dragLevel]);
  (0, import_react.useLayoutEffect)(() => {
    const track = trackRef.current;
    if (track === null) return;
    track.style.setProperty("--dse-ratio", String(sliderRatio));
  });
  (0, import_react.useEffect)(() => {
    const ratio = efforts.length <= 1 ? 0 : Math.max(0, Math.min(1, themeIndex / (efforts.length - 1)));
    speedTargetRef.current = 14 / (14 - 9 * ratio);
    if (!open) return void 0;
    const sheenTarget = 14 / (6.5 - 2.8 * ratio);
    const animations = [];
    const sheen = sheenRef.current;
    if (sheen !== null) {
      for (const animation of sheen.getAnimations()) {
        if (animation.animationName === "dse-sheen") {
          animations.push({ animation, from: animation.playbackRate, to: sheenTarget });
        }
      }
    }
    if (animations.length === 0) return void 0;
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
  (0, import_react.useEffect)(() => {
    if (!open) return void 0;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (canvas === null || track === null) return void 0;
    const context = canvas.getContext("2d");
    if (context === null) return void 0;
    const reduced = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        twinklePhase: random() * TAU
      };
    };
    const resize = () => {
      width = Math.max(1, track.offsetWidth);
      height = Math.max(1, track.offsetHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
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
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(track);
    let factor = speedTargetRef.current;
    let last = performance.now();
    let elapsed = 0;
    let framesSinceProbe = 0;
    let frame = 0;
    const draw = (timestamp) => {
      const dt = Math.min(0.05, Math.max(0, (timestamp - last) / 1e3));
      last = timestamp;
      elapsed += dt;
      factor += (speedTargetRef.current - factor) * Math.min(1, dt * 5);
      framesSinceProbe += 1;
      if (framesSinceProbe >= 10) {
        framesSinceProbe = 0;
        canvas.dataset.flowSpeed = factor.toFixed(2);
      }
      context.clearRect(0, 0, width, height);
      for (let index = 0; index < 2; index++) {
        const speed = (0.16 + index * 0.1) * factor;
        const size = width * (0.7 + index * 0.25);
        const center = (elapsed * width * speed + width * (0.25 + index * 0.35)) % (width + size) - size / 2;
        const gradient = context.createRadialGradient(center, height / 2, 0, center, height / 2, size / 2);
        gradient.addColorStop(0, "rgba(255, 255, 255, " + (index === 0 ? 0.12 : 0.08) + ")");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }
      for (const bubble of bubbles) {
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
        context.beginPath();
        context.arc(bubble.x, drawY, bubble.radius, 0, TAU);
        context.fillStyle = "rgba(255, 255, 255, " + (alpha * 0.88).toFixed(3) + ")";
        context.fill();
        if (bubble.radius > 1.25) {
          const halo = context.createRadialGradient(
            bubble.x,
            drawY,
            bubble.radius * 0.5,
            bubble.x,
            drawY,
            bubble.radius * 2.1
          );
          halo.addColorStop(0, "rgba(255, 255, 255, " + (alpha * 0.22).toFixed(3) + ")");
          halo.addColorStop(1, "rgba(255, 255, 255, 0)");
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
  const slider = hasReasoning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.slider, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      ref: trackRef,
      className: cx(styles_default2.track, dragging && styles_default2.dragging),
      "data-off": isOffLevel ? "" : void 0,
      title: displayHint ?? t("slider.hint"),
      "aria-description": displayHint ?? void 0,
      onPointerDown: onTrackPointerDown,
      onPointerMove: onTrackPointerMove,
      onPointerUp: onTrackPointerUp,
      onPointerCancel: onTrackPointerCancel,
      onLostPointerCapture,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.trackBase }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.ticks, "aria-hidden": "true", children: efforts.map((level, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "span",
          {
            className: styles_default2.tick,
            style: { left: stopLeft(index, efforts.length) }
          },
          level.id
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.fill }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_default2.flow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref: canvasRef, className: styles_default2.bubbles, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: sheenRef, className: styles_default2.sheen })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: styles_default2.knob,
            role: "slider",
            tabIndex: 0,
            "aria-label": t("slider.aria"),
            "aria-valuemin": 0,
            "aria-valuemax": efforts.length - 1,
            "aria-valuenow": previewIndex === void 0 ? 0 : previewIndex,
            "aria-valuetext": displayLevelName,
            "aria-description": displayHint ?? void 0,
            "aria-disabled": locked || busy
          }
        )
      ]
    }
  ) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.sliderHint, children: t("hint.noReasoning") });
  const rootPane = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_default2.header, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.bolt, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoltIcon, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.headings, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.levelName, children: displayLevelName }) }),
      reasoning !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: styles_default2.reset,
          "aria-label": t("action.reset"),
          title: t("action.reset"),
          disabled: locked || busy || isDefault,
          onClick: resetEffort,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconRefreshOutlineRegular, { size: 16 })
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        type: "button",
        className: styles_default2.modelRow,
        disabled: locked || busy,
        "aria-label": t("menu.model"),
        onClick: () => {
          setPane("model");
          setQuery("");
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.modelRowName, children: currentChoice === void 0 ? modelLabel : renderModelLabel(currentChoice.group.provider, currentChoice.model, "menu", true) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronRightOutlineRegular, { className: styles_default2.modelRowChevron })
        ]
      }
    ),
    slider,
    error !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.error, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }) }) : null
  ] });
  const modelPane = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_default2.modelHeader, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: styles_default2.back,
          "aria-label": t("action.back"),
          onClick: () => {
            setPane("root");
            setQuery("");
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronLeftOutlineRegular, {})
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.modelTitle, children: t("menu.model") })
    ] }),
    showSearch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_default2.searchRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_dsh_client_ui_primitives.Input,
        {
          ref: searchRef,
          className: cx(styles_default2.search, query !== "" && styles_default2.searchWithQuery),
          type: "text",
          role: "searchbox",
          "aria-label": t("search.placeholder"),
          placeholder: t("search.placeholder"),
          value: query,
          readOnly: busy,
          onChange: (event) => setQuery(event.target.value)
        }
      ),
      query !== "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: styles_default2.searchClear,
          "aria-label": t("search.clear"),
          disabled: busy,
          onClick: () => {
            setQuery("");
            searchRef.current?.focus?.();
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconCloseFillRegular, {})
        }
      ) : null
    ] }) : null,
    state.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.status, children: t("status.loading") }) : null,
    state.error !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_default2.error, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("error.action", { message: state.error }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: styles_default2.retry, onClick: () => load?.(), children: t("action.retry") })
    ] }) : null,
    state.failures.map((failure) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_default2.warning, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("warning.groupLoad", {
        name: failure.id === "deepseek-account" ? t("provider.account") : failure.name,
        message: failure.message
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: styles_default2.retry, onClick: () => load?.(), children: t("action.retry") })
    ] }, failure.id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        ref: groupsRef,
        className: cx(styles_default2.groups, "scrollable"),
        role: "menu",
        "aria-label": t("menu.model"),
        hidden: filteredGroups.length === 0,
        children: filteredGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.MenuGroup, { label: group.provider.name, children: group.models.map((model) => {
          const selected = state.current !== null && state.current.provider === group.id && state.current.model === model.id;
          const pendingThis = state.pending !== null && state.pending.provider === group.id && state.pending.model === model.id;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              type: "button",
              role: "menuitemradio",
              "aria-checked": selected,
              title: model.name,
              className: styles_default2.option,
              disabled: busy,
              onClick: () => chooseModel(group.id, model.id),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.optionCopy, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.modelName, children: renderModelLabel(group.provider, model, "option", selected) }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.check, children: pendingThis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.StateDot, { state: "ongoing" }) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconCheckOutlineRegular, {}) : null })
              ]
            },
            model.id
          );
        }) }, group.id))
      }
    ),
    state.status === "ready" && filteredGroups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.empty, role: "status", children: t(choices.length === 0 ? "empty.models" : "search.empty") }) : null,
    error !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: styles_default2.error, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }) }) : null
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: rootRef, className: styles_default2.root, onMouseDown: (event) => {
    if (event.target instanceof Element && event.target.closest("button") !== null) {
      event.preventDefault();
    }
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        ref: triggerRef,
        type: "button",
        className: styles_default2.trigger,
        "aria-label": triggerAria,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": open ? id + "-menu" : void 0,
        title: triggerTitle,
        "aria-busy": busy,
        "data-selection-focus": selectionFocus ? "" : void 0,
        onBlur: () => setSelectionFocus(false),
        disabled: locked,
        onClick: () => {
          if (open) {
            close(true);
          } else {
            setSelectionFocus(false);
            triggerRef.current?.focus?.();
            show();
          }
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconDataOutlineRegular, { className: styles_default2.triggerIcon, size: 16 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.triggerLabel, children: currentChoice === void 0 ? modelLabel : renderModelLabel(currentChoice.group.provider, currentChoice.model, "trigger", true) }),
          triggerEffortLabel !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_default2.triggerEffort, children: triggerEffortLabel }) : null,
          busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.StateDot, { state: "ongoing" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: cx(styles_default2.chevron, open && styles_default2.chevronOpen) })
        ]
      }
    ),
    open ? (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_dsh_client_ui_primitives.MenuSurface,
        {
          ref: menuRef,
          id: id + "-menu",
          className: styles_default2.popover,
          style: {
            ...menuPos ?? MEASURE_STYLE,
            "--dse-accent": theme.accent,
            "--dse-fill": theme.fill,
            "--dse-glow": theme.glow,
            "--dse-ring": theme.ring
          },
          role: "dialog",
          "aria-label": t("popover.aria"),
          "aria-busy": state.status === "loading" || busy,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: panelRef, className: styles_default2.panel, tabIndex: -1, onKeyDown: onPanelKeyDown, children: pane === "root" ? rootPane : modelPane })
        }
      ),
      document.body
    ) : null
  ] });
}

// src/client/index.jsx
var name = "dsh-effort-slider";
var inject = ["locale", "slots", "sessions", "remote", "remote.session", "modelDirectories"];
var NS = "effort-slider";
function apply(ctx) {
  if (typeof document !== "undefined") installStyles(document, styles_default);
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-effort-slider: dictionaries");
  ctx.inject(["slots", "modelDirectories", "sessions"], (scope) => {
    const models = scope.modelDirectories;
    const sessions = scope.sessions;
    scope.slots.inject(
      "conversation.input.model",
      () => scope.slots.register(
        {
          name: "conversation.input.model",
          locale: NS,
          priority: -1,
          inject: (sessionId) => {
            const directory = models.directoryFor(sessionId);
            const available = sessions.subagentAddress(sessionId) === void 0;
            return {
              available,
              directory: directory.store,
              load: () => {
                if (available) directory.load().catch(() => {
                });
              },
              select: (selection) => available ? directory.select(selection) : Promise.resolve(void 0)
            };
          }
        },
        EffortSeat
      )
    );
  });
}
return Object.defineProperty({ ...module.exports }, Symbol.toStringTag, { value: 'Module' })
  },
})
