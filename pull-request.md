# 添加 CI/CD 和测试自动化配置

## 变更内容

本 PR 实现了项目的 CI/CD 工作流和测试自动化，主要包括以下内容：

### GitHub Actions 工作流

- **测试工作流** (.github/workflows/test.yml)

  - 在推送到 main/develop 分支或 PR 时自动运行测试
  - 生成测试覆盖率报告并上传作为 Artifacts
  - 确保代码质量和功能完整性

- **部署工作流** (.github/workflows/deploy.yml)
  - 测试通过后自动部署到不同环境
  - 支持 PR 预览环境、开发环境和生产环境部署
  - 可通过手动触发(workflow_dispatch)部署

### 测试配置

- 配置 Vitest 测试框架与覆盖率报告
- 设置测试覆盖率阈值(70%)确保代码质量
- 添加测试辅助函数和环境配置

### 文档

- 更新 README 添加测试和 CI/CD 相关说明
- 添加 CICD_README.md 详细说明工作流程
- 添加 Secrets 配置指南

## 测试验证

- 本地运行所有测试并确认通过: `npm test`
- 验证测试覆盖率报告生成
- 手动触发 GitHub Actions 工作流测试部署流程

## 注意事项

- 需要在 GitHub 仓库设置中配置相关 Secrets 才能正常使用部署功能
  - VERCEL_TOKEN
  - VERCEL_ORG_ID
  - VERCEL_PROJECT_ID
- 详细配置指南请参考 [SECRETS_SETUP.md](./SECRETS_SETUP.md)

## 截图

[此处应包含相关截图，例如测试覆盖率报告、工作流运行结果等]

## 相关问题

解决了 #123
