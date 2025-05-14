# 后端密码找回功能实现指南 (Crow C++ 框架)

基于您现有的前端代码，本指南将帮助您使用 **Crow C++** 框架实现完整的密码重置功能。

## 1. 后端API端点设计

您需要实现三个主要的API端点：

### 1.1 请求密码重置

**端点:** `POST /api/auth/forgot-password`

**功能:** 接收用户邮箱，验证有效性，生成重置令牌并发送重置邮件

**请求体:**
```json
{
  "email": "user@example.com"
}
```

**响应:**
```json
{
  "message": "Password reset email sent"
}
```

### 1.2 验证重置令牌

**端点:** `GET /api/auth/reset-password/verify/:token`

**功能:** 验证重置令牌的有效性

**响应:**
```json
{
  "valid": true
}
```
或
```json
{
  "valid": false,
  "message": "Token expired"
}
```

### 1.3 重设密码

**端点:** `POST /api/auth/reset-password`

**功能:** 使用有效令牌重置用户密码

**请求体:**
```json
{
  "token": "reset-token-here",
  "password": "new-password"
}
```

**响应:**
```json
{
  "message": "Password reset successful"
}
```

## 2. 数据库设计

需要在数据库中添加以下表来支持密码重置功能：

```sql
CREATE TABLE password_reset_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

## 3. Crow C++ 实现步骤

### 3.1 密码重置请求处理

```cpp
CROW_ROUTE(app, "/api/auth/forgot-password").methods(crow::HTTPMethod::POST)
([&](const crow::request& req) {
    auto x = crow::json::load(req.body);
    
    // 验证请求体格式
    if (!x || !x.has("email")) {
        return crow::response(400, "{\"message\": \"Invalid request format\"}");
    }
    
    std::string email = x["email"].s();
    
    // 验证电子邮件格式
    if (email.empty() || email.find('@') == std::string::npos) {
        return crow::response(400, "{\"message\": \"Invalid email address\"}");
    }
    
    try {
        // 检查用户是否存在
        auto conn = pool.getConnection();
        auto qResult = conn->query("SELECT user_id, email FROM users WHERE email = ?", email);
        
        // 安全考虑：响应保持一致，不泄露是否找到用户
        crow::json::wvalue result;
        result["message"] = "If your email is registered, you will receive a password reset link";
        
        if (qResult.next()) {
            std::string userId = qResult["user_id"];
            
            // 生成唯一重置令牌 (32字节随机字符串)
            std::string token = generateRandomToken(32);
            
            // 设置令牌过期时间（1小时后）
            auto expiresAt = std::chrono::system_clock::now() + std::chrono::hours(1);
            std::time_t expTime = std::chrono::system_clock::to_time_t(expiresAt);
            
            // 保存重置令牌到数据库
            conn->query(
                "INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES (UUID(), ?, ?, ?)",
                userId, token, expTime
            );
            
            // 发送重置邮件
            sendPasswordResetEmail(email, token);
        }
        
        return crow::response(200, result);
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Password reset request error: " << e.what();
        return crow::response(500, "{\"message\": \"An error occurred while processing your request\"}");
    }
});
```

### 3.2 发送密码重置邮件

```cpp
void sendPasswordResetEmail(const std::string& email, const std::string& token) {
    // 使用您选择的邮件发送库，例如 SMTPClient 或 libcurl
    
    // 重置链接
    std::string resetUrl = std::string(getenv("FRONTEND_URL")) + "/reset-password/" + token;
    
    // 邮件内容
    std::string emailBody = R"(
        <h1>Password Reset</h1>
        <p>You requested a password reset for your Adelaide Fringe account.</p>
        <p>Please click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href=")" + resetUrl + R"(" style="display: inline-block; padding: 10px 20px; background-color: #ff3366; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this password reset, please ignore this email.</p>
    )";
    
    // 发送邮件的实现
    // 注意：这里需要根据您选择的邮件库实现具体发送逻辑
    // sendEmail(email, "Password Reset Request", emailBody);
}
```

### 3.3 验证重置令牌

```cpp
CROW_ROUTE(app, "/api/auth/reset-password/verify/<string>")
([&](const std::string& token) {
    try {
        auto conn = pool.getConnection();
        auto qResult = conn->query(
            "SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()",
            token
        );
        
        crow::json::wvalue result;
        if (qResult.next()) {
            result["valid"] = true;
            return crow::response(200, result);
        } else {
            result["valid"] = false;
            result["message"] = "Invalid or expired reset token";
            return crow::response(400, result);
        }
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Token verification error: " << e.what();
        
        crow::json::wvalue result;
        result["valid"] = false;
        result["message"] = "An error occurred while verifying the token";
        return crow::response(500, result);
    }
});
```

### 3.4 重设密码

```cpp
CROW_ROUTE(app, "/api/auth/reset-password").methods(crow::HTTPMethod::POST)
([&](const crow::request& req) {
    auto x = crow::json::load(req.body);
    
    // 验证请求体格式
    if (!x || !x.has("token") || !x.has("password")) {
        return crow::response(400, "{\"message\": \"Invalid request format\"}");
    }
    
    std::string token = x["token"].s();
    std::string password = x["password"].s();
    
    // 验证密码强度
    if (password.length() < 6) {
        return crow::response(400, "{\"message\": \"Password must be at least 6 characters long\"}");
    }
    
    try {
        auto conn = pool.getConnection();
        
        // 查询令牌并确保有效
        auto tokenResult = conn->query(
            "SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()",
            token
        );
        
        if (!tokenResult.next()) {
            return crow::response(400, "{\"message\": \"Invalid or expired reset token\"}");
        }
        
        std::string userId = tokenResult["user_id"];
        
        // 加密新密码
        std::string hashedPassword = hashPassword(password);
        
        // 更新用户密码
        conn->query("UPDATE users SET password = ? WHERE user_id = ?", hashedPassword, userId);
        
        // 标记令牌为已使用
        conn->query("UPDATE password_reset_tokens SET used = TRUE WHERE token = ?", token);
        
        crow::json::wvalue result;
        result["message"] = "Password reset successful";
        return crow::response(200, result);
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Password reset error: " << e.what();
        return crow::response(500, "{\"message\": \"An error occurred while resetting the password\"}");
    }
});
```

## 4. 安全考虑

- **令牌安全性**: 使用足够长的随机令牌，防止暴力破解
- **过期时间**: 设置合理的过期时间，例如1小时
- **一次性使用**: 令牌使用后立即标记为已使用，防止重复使用
- **信息泄露**: 不要在API响应中泄露哪些邮箱已注册
- **密码安全**: 重置的密码应符合安全标准，并使用适当算法加密存储
- **速率限制**: 对密码重置API实施速率限制，防止滥用

## 5. 前后端对接

您的前端代码中已经实现了以下功能，现在需要修改为实际调用后端API：

### 请求密码重置

```javascript
export const requestPasswordReset = async (email) => {
  const response = await fetch(apiUrl('/auth/forgot-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to request password reset');
  }

  return response.json();
};
```

### 验证重置令牌

```javascript
export const verifyResetToken = async (token) => {
  const response = await fetch(apiUrl(`/auth/reset-password/verify/${token}`));

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid reset token');
  }

  const data = await response.json();
  return data.valid;
};
```

### 重设密码

```javascript
export const resetPassword = async (token, password) => {
  const response = await fetch(apiUrl('/auth/reset-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset password');
  }

  return response.json();
};
```

## 6. 工具函数

### 生成随机令牌

```cpp
std::string generateRandomToken(size_t length) {
    static const char alphanum[] =
        "0123456789"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz";
        
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, sizeof(alphanum) - 2);
    
    std::string token;
    token.reserve(length);
    
    for (size_t i = 0; i < length; ++i) {
        token += alphanum[dis(gen)];
    }
    
    return token;
}
```

### 密码哈希

```cpp
std::string hashPassword(const std::string& password) {
    // 使用您选择的密码哈希库，例如 bcrypt、Argon2 等
    // 这里是一个示例实现
    // return bcrypt::generateHash(password);
    
    // 或使用 OpenSSL
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, password.c_str(), password.size());
    SHA256_Final(hash, &sha256);
    
    std::stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    }
    return ss.str();
}
```

## 7. 测试步骤

1. 创建 `password_reset_tokens` 表
2. 实现上述 API 端点
3. 测试邮件发送功能
4. 使用 API 测试工具（如 Postman）测试各个端点
5. 将前端与后端集成
6. 测试完整流程：请求重置 → 接收邮件 → 点击链接 → 输入新密码 → 重设成功

## 8. 必要的头文件

```cpp
#include <crow.h>
#include <chrono>
#include <ctime>
#include <random>
#include <iomanip>
#include <openssl/sha.h>  // 如果使用 OpenSSL 进行哈希
// 其他必要的头文件
```

完成以上步骤后，您将拥有一个使用 Crow C++ 框架实现的完整密码找回功能。