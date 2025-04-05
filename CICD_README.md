# CI/CD 工作流程文档

## 概述

本项目使用 GitHub Actions 实现持续集成/持续部署 (CI/CD)，实现自动化测试和部署。

## 工作流程

项目包含以下自动化工作流:

### 测试和部署流程

触发条件:

- 推送到 `main` 或 `develop` 分支时
- 针对 `main` 或 `develop` 分支的 Pull Request

工作流阶段:

1. **测试阶段**

   - 运行项目的所有单元测试和集成测试
   - 生成测试覆盖率报告
   - 上传测试结果作为 GitHub Artifacts

2. **预览部署** (仅 Pull Request)

   - 为每个 PR 创建临时预览环境
   - 部署到 Vercel 预览环境
   - 在 PR 中提供预览链接

3. **开发环境部署** (仅 `develop` 分支)

   - 使用开发配置构建项目
   - 部署到 Vercel 开发环境 (dev.your-domain.com)

4. **生产环境部署** (仅 `main` 分支)
   - 使用生产配置构建项目
   - 部署到 Vercel 生产环境

## 分支策略

为确保 CI/CD 流程顺畅，请遵循以下分支策略:

1. **功能开发**:

   - 从 `develop` 分支创建功能分支 (`feature/xxx`)
   - 开发完成后，向 `develop` 分支提交 Pull Request
   - PR 必须通过测试和代码审查

2. **错误修复**:

   - 紧急 bug 从 `main` 创建 hotfix 分支 (`hotfix/xxx`)
   - 非紧急 bug 从 `develop` 创建分支 (`bugfix/xxx`)

3. **发布流程**:
   - 准备发布时，从 `develop` 创建发布分支 (`release/xxx`)
   - 修复所有发布相关问题
   - 完成后合并到 `main` 和 `develop`

## 项目部署指南

### 本地测试

在推送代码前，请运行以下命令确保代码质量:

```bash
# 安装依赖
npm ci

# 运行测试
npm test

# 本地构建
npm run build:dev
```

### 手动触发部署

如需手动触发部署:

1. 前往 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 选择 "Test and Deploy" 工作流
4. 点击 "Run workflow" 按钮
5. 选择要部署的分支，点击 "Run workflow"

## 部署环境

| 环境 | URL                         | 分支    | 更新频率              |
| ---- | --------------------------- | ------- | --------------------- |
| 生产 | https://your-domain.com     | main    | 每次 main 分支更新    |
| 开发 | https://dev.your-domain.com | develop | 每次 develop 分支更新 |
| 预览 | 每个 PR 有唯一 URL          | PR 分支 | 每次 PR 更新          |

## 故障排除

如果 CI/CD 流程出现问题，请检查:

1. 测试失败 - 查看测试日志了解详细错误
2. 构建失败 - 检查依赖和构建脚本
3. 部署失败 - 确认 Vercel 配置和 secrets 设置
