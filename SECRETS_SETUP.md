# 配置 GitHub Secrets 指南

## 需要设置的 Secrets

要让 CI/CD 工作流正常工作，您需要在 GitHub 仓库设置以下 secrets:

1. `VERCEL_TOKEN` - Vercel 个人访问令牌
2. `VERCEL_ORG_ID` - Vercel 组织 ID
3. `VERCEL_PROJECT_ID` - Vercel 项目 ID
4. `GITHUB_TOKEN` - 自动提供，无需手动设置

## 获取 Vercel 信息

### 获取 Vercel Token

1. 登录您的 [Vercel 账户](https://vercel.com/dashboard)
2. 点击右上角的头像，然后选择 "Settings"
3. 在左侧菜单中，选择 "Tokens"
4. 点击 "Create" 按钮，创建一个新的令牌
5. 为令牌提供一个描述性名称（如 "GitHub Actions"）
6. 选择 "Full Account" 作为范围
7. 点击 "Create" 按钮
8. 复制生成的令牌（只会显示一次）

### 获取 Organization ID 和 Project ID

1. 登录 Vercel 并导航到您的项目
2. 点击 "Settings" 标签
3. 滚动到页面底部的 "General" 部分
4. 在 "Project ID" 字段中找到项目 ID
5. 复制此 ID

对于 Organization ID:

1. 使用 Vercel CLI 登录: `vercel login`
2. 运行: `vercel whoami`
3. 复制显示的组织 ID

## 在 GitHub 中设置 Secrets

1. 前往您的 GitHub 仓库页面
2. 点击 "Settings" 标签
3. 在左侧导航栏中，点击 "Secrets and variables" -> "Actions"
4. 点击 "New repository secret" 按钮
5. 添加以下 secrets:
   - 名称: `VERCEL_TOKEN`，值: 您的 Vercel 令牌
   - 名称: `VERCEL_ORG_ID`，值: 您的 Vercel 组织 ID
   - 名称: `VERCEL_PROJECT_ID`，值: 您的 Vercel 项目 ID
6. 每次添加完成后，点击 "Add secret" 按钮

## 验证设置

设置完成后，推送代码到仓库或创建一个新的 Pull Request 来触发工作流。您可以在仓库的 "Actions" 标签页中查看工作流的执行情况。

## 疑难解答

如果遇到 Vercel 部署问题，请检查以下几点:

1. 确保 secrets 大小写正确
2. 验证 Vercel 令牌未过期
3. 确认项目和组织 ID 输入正确
4. 检查 Vercel 项目是否与 GitHub 仓库关联
