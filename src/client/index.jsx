import cssText from './styles.css';
import { zh, en } from './dictionary.js';
import { installStyles } from './install-styles.js';
import { EffortSeat } from './seat.jsx';

export const name = 'dsh-effort-slider';

/**
 * 客户端所需服务：
 * - slots：注册 composer 模型座位；
 * - locale：字典；
 * - sessions 与 modelDirectories：官方 ui-model-selection 提供的会话级模型目录。
 */
export const inject = ['locale', 'slots', 'sessions', 'remote', 'remote.session', 'modelDirectories'];

/** 本插件自己的 locale 命名空间。 */
const NS = 'effort-slider';

/**
 * 浏览器半侧入口：在 `conversation.input.model` 这个 single slot 里以 priority -1 注册自己的座位。
 *
 * 官方 ui-model-selection 在同一 slot 用默认优先级 0 注册 ModelSelect；single slot 的渲染规则是
 * 「同优先级冲突、最低优先级渲染」，所以 -1 会把官方座位遮住（官方包的 /model 命令与其他能力
 * 不受影响）。不声明 children：`conversation.input.model.label` 仍由官方条目声明，1017 角标
 * 这类标签扩展照常生效。
 */
export function apply(ctx) {
  if (typeof document !== 'undefined') installStyles(document, cssText);

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-effort-slider: dictionaries');

  ctx.inject(['slots', 'modelDirectories', 'sessions'], (scope) => {
    const models = scope.modelDirectories;
    const sessions = scope.sessions;
    scope.slots.inject('conversation.input.model', () =>
      scope.slots.register(
        {
          name: 'conversation.input.model',
          locale: NS,
          priority: -1,
          inject: (sessionId) => {
            const directory = models.directoryFor(sessionId);
            const available = sessions.subagentAddress(sessionId) === undefined;
            return {
              available,
              directory: directory.store,
              load: () => {
                if (available) directory.load().catch(() => {});
              },
              select: (selection) => (available ? directory.select(selection) : Promise.resolve(undefined)),
            };
          },
        },
        EffortSeat,
      ),
    );
  });
}
