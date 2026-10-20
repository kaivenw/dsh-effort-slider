# dsh-effort-slider · 安装说明

把 DSH 输入框右下角的「模型 / 推理强度」座位换成 Codex 风格的可拖动强度条：点开是
档位名 + 模型切换行 + 滑杆。档位来自模型目录本身（DeepSeek 是 Off / Low / High / Max），
不写死模型。

- 档位越高填充越长；普通档位蓝色（越高色相越深），最高档紫蓝渐变，**Off 不铺颜色**。
- 轨道上的小圆点标出当前档位之后的档位；填充段有流动的星点，档位越高流动越快，切换档位时速度会平滑过渡。
- 拖动跟手、松手吸附到最近档位。

![High 档位](docs/popover-high.png)

## 适用环境

- **DSH 桌面端 0.2.1-rc.2**（本项目按这个版本的浏览器端插件接口打包；其它 0.2.x
  版本没有验证）。版本不匹配时不会弄坏 DSH：插件加载失败会退回官方下拉列表。
- macOS：双击 `install.command` 即可，不需要自己装 Node.js（脚本会借用 DSH 自带的运行时）。
- Linux / Windows：需要 Node.js 18+，在解压目录执行 `node install-profile.mjs`。
  Windows 的目录链接用 junction，不需要管理员权限。

## 安装

1. 把压缩包解压到一个**不会被清理、以后也不会移动**的目录，例如
   `~/Documents/dsh-effort-slider`。安装后 profile 里是一条指向该目录的软链，
   目录被删掉或移走，插件就失效了。
2. 双击 `install.command`。
   - macOS 若提示「无法验证开发者」：右键点击 `install.command` → `打开`；
     或在终端里执行：
     ```bash
     cd <解压目录>
     ./install.command
     ```
   - 脚本会打印改了哪些文件、原文件备份在哪里。
3. **完全退出 DSH 再打开**（`Cmd+Q`，不是只关窗口）。profile 的插件组合在启动时加载。

## 验收

- 座位外观不变（仍显示当前模型 + 当前档位）；点它，应该出现滑杆卡片：
  左上闪电、中间档位名与说明、模型行、紫色渐变滑杆。
- 拖动滑杆松手，座位文字变成对应档位；发下一条消息就按新档位请求。
- 如果还是官方的下拉列表：到 DSH「插件」页查看 `@local/dsh-effort-slider`
  的加载错误；或按下面卸载后反馈。

## 卸载

在解压目录执行：

```bash
node install-profile.mjs --uninstall
# macOS 也可以：./install.command --uninstall
```

然后同样完全退出再打开 DSH。

## 安装脚本改了什么

只动当前用户的 DSH profile（默认 `~/.dsh/profiles/desktop`，没有就找 `web`）：

1. `package.json` 的 `dependencies` 加一条
   `"@local/dsh-effort-slider": "link:<解压目录>"`；
2. 同一份 `package.json` 的 `dsh.profile.bundles` 末尾追加 `@local/dsh-effort-slider`；
3. 建 `node_modules/@local/dsh-effort-slider` 目录软链。

写盘前会把原 `package.json` 备份成 `package.json.bak-dsh-effort-slider-<时间>`；
重复运行是幂等的。

## 边界与已知行为

- 它遮住的是官方 `@deepseek-ai/dsh-client-ui-model-selection` 的 composer 座位。
  **不要停用官方的模型选择插件**，否则本插件不会激活（座位会整个消失）。
  `/model` 命令、模型目录、官方角标等仍由官方包提供。
- Bot 模式下座位本来就会被 ds-bot 隐藏，滑杆只在 Agent 模式可见。
- 只换交互，不改请求：档位选择仍走 `session.selectModel`，从下一次请求生效。
- 当前模型没有推理档位元数据时，弹层只显示模型切换行，不显示滑杆。