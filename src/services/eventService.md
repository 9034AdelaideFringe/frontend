# 活动创建系统后端实现指南 (适用于 Neon PostgreSQL)

本文档提供了Adelaide Fringe活动管理系统后端实现的详细指导，特别是关于活动创建流程、图片上传和票种管理的实现，使用Neon PostgreSQL作为数据库服务。

## 系统流程概览

活动创建的完整流程如下：

1. 管理员上传活动图片和场馆座位图到云存储服务
2. 云存储服务返回图片URL到前端
3. 管理员填写活动详情和票种信息
4. 前端将完整的活动信息（包括图片URL和票种信息）发送到后端
5. 后端先创建活动记录并获取新活动ID
6. 后端使用活动ID为每种票型创建记录
7. 返回成功信息给前端

## 1. 数据库设计 (PostgreSQL)

### 1.1 设置 Neon PostgreSQL 连接

```cpp
#include <crow.h>
#include <pqxx/pqxx>
#include <string>

// Neon PostgreSQL 连接配置
const std::string db_connection_string = 
    "postgresql://[username]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require";
```

### 1.2 活动表 (events)

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  image VARCHAR(255),
  venue_seating_layout VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  end_time TIME,
  venue VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加更新时间触发器
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_events_modtime
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
```

### 1.3 票种表 (ticket_types)

```sql
CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  available_quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 添加更新时间触发器
CREATE TRIGGER update_ticket_types_modtime
BEFORE UPDATE ON ticket_types
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
```

## 2. 图片上传服务

### 2.1 云存储配置 (使用 AWS S3)

```cpp
#include <crow.h>
#include <aws/core/Aws.h>
#include <aws/s3/S3Client.h>
#include <aws/s3/model/PutObjectRequest.h>

// 初始化AWS SDK
Aws::SDKOptions options;
Aws::InitAPI(options);

// 创建S3客户端 - 为Neon项目配置适当的存储
Aws::Auth::AWSCredentials credentials;
credentials.SetAWSAccessKeyId("your-access-key");
credentials.SetAWSSecretKey("your-secret-key");

Aws::Client::ClientConfiguration clientConfig;
clientConfig.region = "ap-southeast-2"; // 选择适合您的区域

Aws::S3::S3Client s3_client(credentials, clientConfig);
```

### 2.2 图片上传端点

```cpp
// 图片上传处理端点
CROW_ROUTE(app, "/api/upload/image")
  .methods(crow::HTTPMethod::POST)
([&](const crow::request& req) {
    // 检查身份验证
    if (!isAuthenticated(req) || !isAdmin(req)) {
        return crow::response(403, "{\"message\": \"Unauthorized access\"}");
    }
    
    // 解析multipart/form-data请求
    auto& parser = const_cast<crow::request&>(req);
    std::string filename = generateUniqueFilename();
    
    // 从请求中提取图片数据
    const crow::multipart::message& parts = parser.get_multipart_form_data();
    
    for(const auto& part : parts) {
        if (part.name == "image") {
            // 上传文件到S3
            Aws::S3::Model::PutObjectRequest object_request;
            object_request.SetBucket("your-bucket-name");
            object_request.SetKey("images/" + filename);
            
            // 设置内容类型
            std::string contentType = part.content_type;
            object_request.SetContentType(contentType);
            
            // 创建数据流
            auto body = Aws::MakeShared<Aws::StringStream>("WriteObjectBodyStream");
            *body << part.body;
            object_request.SetBody(body);
            
            // 执行上传
            auto put_object_outcome = s3_client.PutObject(object_request);
            
            if (put_object_outcome.IsSuccess()) {
                // 构建图片URL
                std::string imageUrl = "https://your-bucket-name.s3.amazonaws.com/images/" + filename;
                
                crow::json::wvalue response;
                response["imageUrl"] = imageUrl;
                return crow::response(200, response);
            } else {
                CROW_LOG_ERROR << "S3 upload error: " << put_object_outcome.GetError().GetMessage();
                return crow::response(500, "{\"message\": \"Failed to upload image\"}");
            }
        }
    }
    
    return crow::response(400, "{\"message\": \"No image file found in request\"}");
});

// 生成唯一文件名
std::string generateUniqueFilename() {
    auto now = std::chrono::system_clock::now();
    auto timestamp = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&timestamp), "%Y%m%d%H%M%S_");
    
    // 添加一些随机性
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(10000, 99999);
    ss << dis(gen) << ".jpg"; // 假设为jpg，实际应根据mimetype确定
    
    return ss.str();
}
```

## 3. 活动创建服务 (使用 PostgreSQL)

### 3.1 PostgreSQL 数据库连接池

```cpp
class PostgresConnectionPool {
private:
    std::vector<std::unique_ptr<pqxx::connection>> connections;
    std::mutex mutex;
    const std::string connectionString;
    const size_t poolSize;

public:
    PostgresConnectionPool(const std::string& connString, size_t size = 10)
        : connectionString(connString), poolSize(size) {
        for (size_t i = 0; i < poolSize; ++i) {
            try {
                connections.push_back(std::make_unique<pqxx::connection>(connectionString));
                CROW_LOG_INFO << "Created DB connection #" << i;
            } catch (const std::exception& e) {
                CROW_LOG_ERROR << "DB connection error: " << e.what();
                throw;
            }
        }
    }

    class PooledConnection {
    private:
        PostgresConnectionPool& pool;
        std::unique_ptr<pqxx::connection> conn;

    public:
        PooledConnection(PostgresConnectionPool& p, std::unique_ptr<pqxx::connection> c)
            : pool(p), conn(std::move(c)) {}

        ~PooledConnection() {
            pool.returnConnection(std::move(conn));
        }

        pqxx::connection* operator->() {
            return conn.get();
        }
    };

    PooledConnection getConnection() {
        std::lock_guard<std::mutex> lock(mutex);
        if (connections.empty()) {
            throw std::runtime_error("No available database connections");
        }

        auto conn = std::move(connections.back());
        connections.pop_back();
        
        // 重新连接如果连接已断开
        if (!conn->is_open()) {
            CROW_LOG_WARNING << "DB connection lost, reconnecting...";
            conn = std::make_unique<pqxx::connection>(connectionString);
        }
        
        return PooledConnection(*this, std::move(conn));
    }

    void returnConnection(std::unique_ptr<pqxx::connection> conn) {
        std::lock_guard<std::mutex> lock(mutex);
        connections.push_back(std::move(conn));
    }
};

// 创建数据库连接池
auto dbPool = std::make_shared<PostgresConnectionPool>(db_connection_string);
```

### 3.2 创建活动端点

```cpp
// 创建活动端点
CROW_ROUTE(app, "/api/event")
  .methods(crow::HTTPMethod::POST)
([&](const crow::request& req) {
    // 验证用户身份
    if (!isAuthenticated(req) || !isAdmin(req)) {
        return crow::response(403, "{\"message\": \"Unauthorized access\"}");
    }
    
    // 解析请求体
    auto x = crow::json::load(req.body);
    if (!x) {
        return crow::response(400, "{\"message\": \"Invalid JSON\"}");
    }
    
    // 验证必填字段
    if (!x.has("title") || !x.has("date") || !x.has("time") || !x.has("venue") || !x.has("capacity")) {
        return crow::response(400, "{\"message\": \"Missing required fields\"}");
    }
    
    try {
        // 获取数据库连接
        auto conn = dbPool->getConnection();
        
        // 从JSON中提取活动信息
        std::string title = x["title"].s();
        std::string description = x.has("description") ? x["description"].s() : "";
        std::string shortDescription = x.has("short_description") ? x["short_description"].s() : "";
        std::string image = x.has("image") ? x["image"].s() : "";
        std::string venueSeatingLayout = x.has("venueSeatingLayout") ? x["venueSeatingLayout"].s() : "";
        std::string date = x["date"].s();
        std::string time = x["time"].s();
        std::string endTime = x.has("end_time") ? x["end_time"].s() : "";
        std::string venue = x["venue"].s();
        int capacity = x["capacity"].i();
        std::string category = x.has("category") ? x["category"].s() : "";
        std::string status = x.has("status") ? x["status"].s() : "ACTIVE";
        
        // 使用PostgreSQL事务
        pqxx::work txn(*conn);
        
        // 创建活动记录并返回生成的ID
        pqxx::result result = txn.exec_params(
            "INSERT INTO events (title, description, short_description, image, venue_seating_layout, date, time, end_time, venue, capacity, category, status) "
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) "
            "RETURNING id",
            title, description, shortDescription, image, venueSeatingLayout, date, time, endTime, 
            venue, capacity, category, status
        );
        
        std::string eventId;
        if (!result.empty()) {
            eventId = result[0][0].as<std::string>();
        } else {
            throw std::runtime_error("Failed to retrieve event ID after insert");
        }
        
        // 处理票种信息（如果提供）
        if (x.has("ticketTypes") && x["ticketTypes"].t() == crow::json::type::List) {
            const auto& ticketTypes = x["ticketTypes"];
            
            for (const auto& ticketType : ticketTypes) {
                std::string name = ticketType["name"].s();
                std::string ticketDescription = ticketType.has("description") ? ticketType["description"].s() : "";
                double price = ticketType["price"].d();
                int availableQuantity = ticketType["availableQuantity"].i();
                
                // 创建票种记录
                txn.exec_params(
                    "INSERT INTO ticket_types (event_id, name, description, price, available_quantity) "
                    "VALUES ($1, $2, $3, $4, $5)",
                    eventId, name, ticketDescription, price, availableQuantity
                );
            }
        }
        
        // 提交事务
        txn.commit();
        
        // 返回成功响应
        crow::json::wvalue response;
        response["id"] = eventId;
        response["message"] = "Event created successfully";
        return crow::response(201, response);
        
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Error creating event: " << e.what();
        return crow::response(500, "{\"message\": \"An error occurred while creating the event\"}");
    }
});
```

### 3.3 更新活动端点

```cpp
// 更新活动端点
CROW_ROUTE(app, "/api/event/<string>")
  .methods(crow::HTTPMethod::PUT)
([&](const crow::request& req, const std::string& eventId) {
    // 验证用户身份
    if (!isAuthenticated(req) || !isAdmin(req)) {
        return crow::response(403, "{\"message\": \"Unauthorized access\"}");
    }
    
    // 解析请求体
    auto x = crow::json::load(req.body);
    if (!x) {
        return crow::response(400, "{\"message\": \"Invalid JSON\"}");
    }
    
    try {
        // 获取数据库连接
        auto conn = dbPool->getConnection();
        
        // 检查活动是否存在
        pqxx::work checkTxn(*conn);
        pqxx::result checkResult = checkTxn.exec_params(
            "SELECT id FROM events WHERE id = $1", 
            eventId
        );
        checkTxn.commit();
        
        if (checkResult.empty()) {
            return crow::response(404, "{\"message\": \"Event not found\"}");
        }
        
        // 启动事务
        pqxx::work txn(*conn);
        
        // 构建更新SQL
        std::string updateQuery = "UPDATE events SET ";
        std::vector<std::string> updateParts;
        
        if (x.has("title")) {
            updateParts.push_back("title = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("description")) {
            updateParts.push_back("description = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("short_description")) {
            updateParts.push_back("short_description = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("image")) {
            updateParts.push_back("image = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("venueSeatingLayout")) {
            updateParts.push_back("venue_seating_layout = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("date")) {
            updateParts.push_back("date = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("time")) {
            updateParts.push_back("time = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("end_time")) {
            updateParts.push_back("end_time = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("venue")) {
            updateParts.push_back("venue = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("capacity")) {
            updateParts.push_back("capacity = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("category")) {
            updateParts.push_back("category = $" + std::to_string(updateParts.size() + 2));
        }
        if (x.has("status")) {
            updateParts.push_back("status = $" + std::to_string(updateParts.size() + 2));
        }
        
        // 如果没有需要更新的字段
        if (updateParts.empty()) {
            crow::json::wvalue response;
            response["message"] = "No fields to update";
            return crow::response(200, response);
        }
        
        // 构建完整查询
        updateQuery += boost::algorithm::join(updateParts, ", ") + " WHERE id = $1";
        
        // 准备参数列表
        std::vector<std::string> params;
        params.push_back(eventId);
        
        if (x.has("title")) {
            params.push_back(x["title"].s());
        }
        if (x.has("description")) {
            params.push_back(x["description"].s());
        }
        if (x.has("short_description")) {
            params.push_back(x["short_description"].s());
        }
        if (x.has("image")) {
            params.push_back(x["image"].s());
        }
        if (x.has("venueSeatingLayout")) {
            params.push_back(x["venueSeatingLayout"].s());
        }
        if (x.has("date")) {
            params.push_back(x["date"].s());
        }
        if (x.has("time")) {
            params.push_back(x["time"].s());
        }
        if (x.has("end_time")) {
            params.push_back(x["end_time"].s());
        }
        if (x.has("venue")) {
            params.push_back(x["venue"].s());
        }
        if (x.has("capacity")) {
            params.push_back(std::to_string(x["capacity"].i()));
        }
        if (x.has("category")) {
            params.push_back(x["category"].s());
        }
        if (x.has("status")) {
            params.push_back(x["status"].s());
        }
        
        // 执行查询
        pqxx::prepare::invocation update = txn.prepared(updateQuery);
        for (const auto& param : params) {
            update(param);
        }
        update.exec();
        
        // 处理票种信息（如果提供）
        if (x.has("ticketTypes") && x["ticketTypes"].t() == crow::json::type::List) {
            // 首先删除现有的票种
            txn.exec_params("DELETE FROM ticket_types WHERE event_id = $1", eventId);
            
            // 然后添加新的票种
            const auto& ticketTypes = x["ticketTypes"];
            
            for (const auto& ticketType : ticketTypes) {
                std::string name = ticketType["name"].s();
                std::string ticketDescription = ticketType.has("description") ? ticketType["description"].s() : "";
                double price = ticketType["price"].d();
                int availableQuantity = ticketType["availableQuantity"].i();
                
                txn.exec_params(
                    "INSERT INTO ticket_types (event_id, name, description, price, available_quantity) "
                    "VALUES ($1, $2, $3, $4, $5)",
                    eventId, name, ticketDescription, price, availableQuantity
                );
            }
        }
        
        // 提交事务
        txn.commit();
        
        // 返回成功响应
        crow::json::wvalue response;
        response["message"] = "Event updated successfully";
        return crow::response(200, response);
        
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Error updating event: " << e.what();
        return crow::response(500, "{\"message\": \"An error occurred while updating the event\"}");
    }
});
```

### 3.4 删除活动端点

```cpp
// 删除活动端点
CROW_ROUTE(app, "/api/event/<string>")
  .methods(crow::HTTPMethod::DELETE)
([&](const crow::request& req, const std::string& eventId) {
    // 验证用户身份
    if (!isAuthenticated(req) || !isAdmin(req)) {
        return crow::response(403, "{\"message\": \"Unauthorized access\"}");
    }
    
    try {
        // 获取数据库连接
        auto conn = dbPool->getConnection();
        
        // 检查活动是否存在
        pqxx::work checkTxn(*conn);
        pqxx::result checkResult = checkTxn.exec_params(
            "SELECT id FROM events WHERE id = $1", 
            eventId
        );
        checkTxn.commit();
        
        if (checkResult.empty()) {
            return crow::response(404, "{\"message\": \"Event not found\"}");
        }
        
        // 启动删除事务
        pqxx::work txn(*conn);
        
        // 删除活动（级联删除会自动删除关联的票种，因为我们设置了ON DELETE CASCADE）
        txn.exec_params("DELETE FROM events WHERE id = $1", eventId);
        txn.commit();
        
        // 返回成功响应
        crow::json::wvalue response;
        response["message"] = "Event deleted successfully";
        return crow::response(200, response);
        
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Error deleting event: " << e.what();
        return crow::response(500, "{\"message\": \"An error occurred while deleting the event\"}");
    }
});
```

## 4. 获取活动信息端点

### 4.1 获取所有活动

```cpp
// 获取所有活动
CROW_ROUTE(app, "/api/events")
([&](const crow::request& req) {
    try {
        // 获取数据库连接
        auto conn = dbPool->getConnection();
        
        // 执行查询
        pqxx::work txn(*conn);
        pqxx::result result = txn.exec(
            "SELECT id, title, description, short_description, image, venue_seating_layout, "
            "date, time, end_time, venue, capacity, category, status, created_at, updated_at "
            "FROM events ORDER BY date DESC"
        );
        txn.commit();
        
        crow::json::wvalue response = crow::json::wvalue::list();
        int i = 0;
        
        for (const auto& row : result) {
            crow::json::wvalue event;
            event["id"] = row["id"].as<std::string>();
            event["title"] = row["title"].as<std::string>();
            event["description"] = row["description"].is_null() ? "" : row["description"].as<std::string>();
            event["short_description"] = row["short_description"].is_null() ? "" : row["short_description"].as<std::string>();
            event["image"] = row["image"].is_null() ? "" : row["image"].as<std::string>();
            event["venueSeatingLayout"] = row["venue_seating_layout"].is_null() ? "" : row["venue_seating_layout"].as<std::string>();
            event["date"] = row["date"].as<std::string>();
            event["time"] = row["time"].as<std::string>();
            event["end_time"] = row["end_time"].is_null() ? "" : row["end_time"].as<std::string>();
            event["venue"] = row["venue"].as<std::string>();
            event["capacity"] = row["capacity"].as<int>();
            event["category"] = row["category"].is_null() ? "" : row["category"].as<std::string>();
            event["status"] = row["status"].as<std::string>();
            
            response[i++] = std::move(event);
        }
        
        return crow::response(200, response);
        
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Error fetching events: " << e.what();
        return crow::response(500, "{\"message\": \"An error occurred while fetching events\"}");
    }
});
```

### 4.2 获取单个活动详情

```cpp
// 获取单个活动详情
CROW_ROUTE(app, "/api/event/<string>")
([&](const std::string& eventId) {
    try {
        // 获取数据库连接
        auto conn = dbPool->getConnection();
        
        // 查询活动信息
        pqxx::work txn(*conn);
        pqxx::result eventResult = txn.exec_params(
            "SELECT id, title, description, short_description, image, venue_seating_layout, "
            "date, time, end_time, venue, capacity, category, status "
            "FROM events WHERE id = $1",
            eventId
        );
        
        if (eventResult.empty()) {
            return crow::response(404, "{\"message\": \"Event not found\"}");
        }
        
        const auto& row = eventResult[0];
        
        crow::json::wvalue response;
        response["id"] = row["id"].as<std::string>();
        response["title"] = row["title"].as<std::string>();
        response["description"] = row["description"].is_null() ? "" : row["description"].as<std::string>();
        response["short_description"] = row["short_description"].is_null() ? "" : row["short_description"].as<std::string>();
        response["image"] = row["image"].is_null() ? "" : row["image"].as<std::string>();
        response["venueSeatingLayout"] = row["venue_seating_layout"].is_null() ? "" : row["venue_seating_layout"].as<std::string>();
        response["date"] = row["date"].as<std::string>();
        response["time"] = row["time"].as<std::string>();
        response["end_time"] = row["end_time"].is_null() ? "" : row["end_time"].as<std::string>();
        response["venue"] = row["venue"].as<std::string>();
        response["capacity"] = row["capacity"].as<int>();
        response["category"] = row["category"].is_null() ? "" : row["category"].as<std::string>();
        response["status"] = row["status"].as<std::string>();
        
        // 查询票种信息
        pqxx::result ticketResult = txn.exec_params(
            "SELECT id, name, description, price, available_quantity "
            "FROM ticket_types WHERE event_id = $1",
            eventId
        );
        
        crow::json::wvalue ticketTypes = crow::json::wvalue::list();
        int i = 0;
        
        for (const auto& ticketRow : ticketResult) {
            crow::json::wvalue ticket;
            ticket["id"] = ticketRow["id"].as<std::string>();
            ticket["name"] = ticketRow["name"].as<std::string>();
            ticket["description"] = ticketRow["description"].is_null() ? "" : ticketRow["description"].as<std::string>();
            ticket["price"] = ticketRow["price"].as<double>();
            ticket["availableQuantity"] = ticketRow["available_quantity"].as<int>();
            
            ticketTypes[i++] = std::move(ticket);
        }
        
        txn.commit();
        
        response["ticketTypes"] = std::move(ticketTypes);
        
        return crow::response(200, response);
        
    } catch (const std::exception& e) {
        CROW_LOG_ERROR << "Error fetching event: " << e.what();
        return crow::response(500, "{\"message\": \"An error occurred while fetching event details\"}");
    }
});
```

## 5. 实现身份验证和授权

### 5.1 JWT验证中间件

```cpp
// JWT身份验证中间件
struct JwtAuthMiddleware {
    std::string secret_key;
    
    JwtAuthMiddleware(const std::string& key) : secret_key(key) {}
    
    struct context {
        std::string userId;
        std::string role;
        bool authenticated = false;
    };
    
    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        // 检查Authorization头
        auto auth_header = req.get_header_value("Authorization");
        if (auth_header.empty() || auth_header.substr(0, 7) != "Bearer ") {
            return;
        }
        
        // 提取令牌
        std::string token = auth_header.substr(7);
        
        try {
            // 验证JWT令牌
            auto decoded = jwt::decode(token);
            auto verifier = jwt::verify()
                .allow_algorithm(jwt::algorithm::hs256{secret_key});
                
            verifier.verify(decoded);
            
            // 提取用户ID和角色信息
            ctx.userId = decoded.get_payload_claim("sub").as_string();
            ctx.role = decoded.get_payload_claim("role").as_string();
            ctx.authenticated = true;
            
        } catch (const std::exception& e) {
            CROW_LOG_ERROR << "JWT verification error: " << e.what();
        }
    }
};

// 检查是否已认证
bool isAuthenticated(const crow::request& req) {
    auto& ctx = req.ctx<JwtAuthMiddleware::context>();
    return ctx.authenticated;
}

// 检查是否为管理员
bool isAdmin(const crow::request& req) {
    auto& ctx = req.ctx<JwtAuthMiddleware::context>();
    return ctx.authenticated && ctx.role == "admin";
}
```

## 6. 前端与后端集成

### 6.1 环境变量配置

创建一个`.env`文件在后端项目根目录下（不要提交到版本控制）：

```
# Neon PostgreSQL 配置
DB_HOST=twilight-hill-04469421.us-east-2.aws.neon.tech
DB_NAME=neondb
DB_USER=your_username
DB_PASSWORD=your_password

# AWS S3 配置
S3_ACCESS_KEY=your_aws_access_key
S3_SECRET_KEY=your_aws_secret_key
S3_REGION=ap-southeast-2
S3_BUCKET=your-bucket-name

# JWT 配置
JWT_SECRET=your_jwt_secret_key

# 应用配置
FRONTEND_URL=http://localhost:3000
PORT=8080
```

### 6.2 读取环境变量

```cpp
#include <crow.h>
#include <cstdlib>
#include <string>

// 读取环境变量，如果不存在则使用默认值
std::string getEnv(const std::string& key, const std::string& defaultValue = "") {
    const char* val = std::getenv(key.c_str());
    return val ? val : defaultValue;
}

// 构建数据库连接字符串
std::string buildDbConnectionString() {
    std::string host = getEnv("DB_HOST", "localhost");
    std::string dbName = getEnv("DB_NAME", "neondb");
    std::string user = getEnv("DB_USER", "postgres");
    std::string password = getEnv("DB_PASSWORD", "");
    
    return "postgresql://" + user + ":" + password + "@" + host + "/" + dbName + "?sslmode=require";
}

// 初始化应用
int main() {
    // 加载环境变量
    crow::SimpleApp app;
    
    // 设置数据库连接
    const std::string db_connection_string = buildDbConnectionString();
    auto dbPool = std::make_shared<PostgresConnectionPool>(db_connection_string);
    
    // 设置JWT密钥
    const std::string jwt_secret = getEnv("JWT_SECRET", "default_secret_key");
    
    // 设置端口
    const int port = std::stoi(getEnv("PORT", "8080"));
    
    // 配置路由
    // ...

    // 启动服务器
    app.port(port).multithreaded().run();
    
    return 0;
}
```

### 6.3 图片上传函数

```javascript
export const uploadImage = async (file) => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('image', file);
    
    // 发送请求
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    // 解析并返回图片URL
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
```

### 6.4 创建活动函数

```javascript
export const createEvent = async (eventData) => {
  try {
    // 准备API请求
    const response = await fetch('/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create event');
    }

    return await response.json();
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};
```

## 7. 测试流程 (使用 Neon PostgreSQL)

1. **数据库连接测试**
   ```bash
   psql "postgresql://[username]:[password]@twilight-hill-04469421.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

2. **创建测试表**
   - 执行上述DDL命令创建`events`和`ticket_types`表

3. **后端API测试**
   - 使用Postman或类似工具测试上述API端点
   - 确保应用能正确连接到Neon PostgreSQL数据库

4. **前端集成测试**
   - 更新前端代码以使用后端API
   - 测试完整的活动创建流程

## 8. Neon PostgreSQL 特定优化

### 8.1 处理连接池

Neon PostgreSQL 有连接时间限制，应当合理管理连接池：

```cpp
// 自动关闭闲置连接
void closeIdleConnections(std::shared_ptr<PostgresConnectionPool> pool) {
    while (true) {
        std::this_thread::sleep_for(std::chrono::minutes(10));
        
        // TODO: 实现闲置连接关闭逻辑
        CROW_LOG_INFO << "Checked for idle connections";
    }
}

std::thread idle_connection_thread(closeIdleConnections, dbPool);
idle_connection_thread.detach();
```

### 8.2 处理断线重连

Neon PostgreSQL 在长时间闲置后可能会断开连接：

```cpp
// 执行带有重试功能的查询
template <typename Func>
auto executeWithRetry(std::shared_ptr<PostgresConnectionPool> pool, Func operation, int maxRetries = 3) {
    for (int attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            auto conn = pool->getConnection();
            return operation(conn);
        } catch (const pqxx::broken_connection& e) {
            CROW_LOG_WARNING << "DB connection broken (attempt " << attempt << "/" << maxRetries << "): " << e.what();
            
            if (attempt == maxRetries) {
                throw;
            }
            
            // 指数退避重试
            std::this_thread::sleep_for(std::chrono::milliseconds(100 * (1 << attempt)));
        }
    }
    
    throw std::runtime_error("Failed to execute operation after maximum retries");
}
```

## 9. 安全注意事项

1. **参数化查询** - 使用 pqxx 的参数化查询避免 SQL 注入
2. **SSL 连接** - 确保使用 `sslmode=require` 参数加密数据库连接
3. **连接字符串保护** - 不要在代码中硬编码连接字符串，使用环境变量
4. **定期备份** - 设置定期备份流程，防止数据丢失
5. **监控连接数** - 监控数据库连接数，避免达到 Neon 的限制

---

实施以上所述的步骤和端点，您将能够成功地将Adelaide Fringe活动管理系统与Neon PostgreSQL数据库集成。
