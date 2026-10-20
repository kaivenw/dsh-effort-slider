#!/bin/bash
# dsh-effort-slider 的一键安装入口：优先用系统 Node.js；没有就借用 DSH 桌面端自带的
# Electron 运行时（ELECTRON_RUN_AS_NODE）。参数原样传给 install-profile.mjs。

cd "$(dirname "$0")" || exit 1

pause_if_double_clicked() {
  if [ "$#" -eq 0 ] && [ -t 0 ]; then
    read -r -p "按回车键关闭窗口…" _ || true
  fi
}

if command -v node >/dev/null 2>&1; then
  node ./install-profile.mjs "$@"
  status=$?
else
  DSH_APP="/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness"
  if [ -x "$DSH_APP" ]; then
    echo "未找到 Node.js，改用 DSH 桌面端内置运行时。"
    ELECTRON_RUN_AS_NODE=1 "$DSH_APP" ./install-profile.mjs "$@"
    status=$?
  else
    echo "没找到 Node.js（也没找到 DSH 桌面端 App）。请先安装 DSH 桌面端，或安装 Node.js 18+ 后重试。" >&2
    status=1
  fi
fi

pause_if_double_clicked "$@"
exit "$status"
