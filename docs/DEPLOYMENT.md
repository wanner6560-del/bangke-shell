# 发布与交接

## 发布包

工作目录可能混有其他个人内容，`pnpm release` 依据 `scripts/package-release.mjs` 的明确清单生成 `releases/bangke-shell-时间戳/` 与压缩包。只包含源代码、公开素材、构建配置和文档；不递归复制整个工作区。

原始日记与图片位于本机 `.private-demo/`，Git 忽略该目录，Vite 不会把它打包进 dist。旧浏览器私人数据保留在旧存储键，公开版不读取。

## GitHub Pages

1. 将发布包中的文件放入目标仓库，默认分支设为 `main`。
2. Settings → Pages → Source 选择 GitHub Actions。
3. 推送 `main` 或手动运行 Deploy Pages 工作流。
4. Actions 完成后访问环境给出的地址；在地址后加 `showcase/` 查看项目案例。

工作流给 Pages 和部署凭证设置最小所需权限，无需自行配置云服务密钥。仓库可见性及账号方案应支持 GitHub Pages。

## 本机复查

```bash
pnpm install --frozen-lockfile
pnpm check
VITE_BASE_PATH=/bangke-shell/ pnpm build
VITE_BASE_PATH=/bangke-shell/ pnpm preview --host 127.0.0.1
```

检查对应的子路径入口。发布前更新 README 中的实际在线链接，不写入假链接或尚未创建的仓库地址。

## 如何更新

修改源码后运行检查；如果从混合工作目录发布，重新执行 release，并只同步发布包。素材替换需更新 `docs/ASSETS.md`。缓存策略发生不兼容变化时升级 `public/sw.js` 的 CACHE 常量。

## 回滚

Pages 站点来自仓库提交。需要回退时，使用正常的 Git revert 创建回滚提交并触发部署。浏览器本地记录不在 GitHub 中，不会随版本回退恢复。
