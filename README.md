# 家庭影像档案馆

一个基于 `Next.js App Router + TypeScript + Tailwind CSS + Prisma + PostgreSQL` 的中文家庭影像整理与家族档案网站。  
MVP 聚焦家庭照片长期整理、浏览、记录与传承，支持人物档案、时间轴、事件相册、地点归档、基础族谱、待整理中心和 JSON 导出。

## 技术栈

- Next.js App Router
- TypeScript 严格模式
- React
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- lucide-react
- 本地文件存储抽象，预留 S3 / MinIO / OSS / COS 适配层

## 当前功能

- 首页 Dashboard
  - 统计卡片
  - 最近照片
  - 人物档案预览
  - 时间轴预览
  - 家庭大事记预览
  - 待整理入口
- 照片管理
  - 列表、详情、上传、新增、编辑、删除
  - 关联人物、地点、事件
  - 按时间、人物、地点、事件筛选
- 人物档案
  - 列表、详情、新增、编辑、删除
  - 展示关联照片与基础关系
- 家族族谱
  - 基础树状展示
  - 支持本人高亮
- 时间轴
  - 按年份合并展示照片与家庭大事记
  - 未知时间自动进入“时间待确认”
- 地点与事件
  - 列表与详情页
  - 展示关联照片
- 待整理中心
  - 未填时间、未关联人物、未填地点、待确认照片聚合
- 管理与导出
  - 总量统计
  - JSON 导出
  - 备份占位说明

## 项目结构

```text
src/
  app/
    api/
    admin/
    events/
    family-tree/
    locations/
    pending/
    people/
    photos/
    timeline/
  components/
    common/
    family-tree/
    layout/
    people/
    photos/
  lib/
    storage/
    validators/
  server/
    services/
  types/

prisma/
  schema.prisma
  seed.ts

public/
uploads/
```

## 本地开发

### 1. 准备环境

需要先安装：

- Node.js 20 或更高版本
- npm 10 或更高版本
- Docker 与 Docker Compose

复制环境变量：

```bash
cp .env.example .env
```

Windows PowerShell 可用：

```powershell
Copy-Item .env.example .env
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动数据库

```bash
docker compose up -d postgres
```

### 4. 生成 Prisma Client 并执行迁移

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. 导入种子数据

```bash
npx prisma db seed
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问：

- 首页：`http://localhost:3000`
- Prisma 数据库连接默认来自 `.env`

## Docker 启动

完整启动：

```bash
docker compose up --build
```

首次启动后，建议在容器内或本机执行：

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

如果使用生产部署流程，推荐改为：

```bash
npx prisma migrate deploy
```

## 环境变量说明

`.env.example` 已提供以下变量：

- `DATABASE_URL`：PostgreSQL 连接串
- `NEXT_PUBLIC_APP_NAME`：前端展示名称
- `UPLOAD_DIR`：开发环境本地上传目录
- `MAX_UPLOAD_SIZE_MB`：单文件上传大小限制
- `STORAGE_DRIVER`：当前支持 `local`，预留 `s3`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_FORCE_PATH_STYLE`

## 上传与文件存储

### 开发阶段

- 上传接口：`POST /api/upload`
- 文件默认写入 `uploads/`
- 数据库仅保存 `fileKey`、`fileUrl`、`thumbnailUrl`
- 通过 `GET /api/files/[...fileKey]` 提供访问

### 生产阶段

建议把 `uploads` 挂载到宿主机目录：

```yaml
volumes:
  - ./uploads:/app/uploads
```

这样容器重建后文件不会丢失。

## 如何切换到 S3 / MinIO / OSS / COS

当前代码已抽象 `StorageProvider`：

- `LocalStorageProvider`
- `S3StorageProvider` 占位

后续切换建议：

1. 在 `src/lib/storage/s3-storage.ts` 中接入真实 SDK
2. 让 `upload`、`delete`、`getPublicUrl` 返回统一结构
3. 设置 `STORAGE_DRIVER=s3`
4. 填写 S3 兼容配置
5. 保持业务层和数据库结构不变

MinIO、阿里云 OSS、腾讯云 COS 都可以通过 S3 兼容接口层统一接入。

## 备份建议

当前版本只提供导出 JSON 和备份说明，没有自动备份任务。  
后续建议：

- 数据库：使用 `pg_dump` 做定期逻辑备份
- 图片文件：同步到对象存储
- 备份任务：使用 cron、GitHub Actions、服务器定时任务或容器调度器执行
- 备份记录：新增 `backup_jobs` 表记录时间、状态、对象存储路径、校验值

## 预留但未实现

- 登录与会话鉴权
- 细粒度权限控制
- 人脸识别自动标注
- 老照片修复
- 地图相册
- 评论协作
- 纪念日提醒
- 操作日志
- 云端定时备份
- 原图/压缩图/缩略图分级存储

## 已实现接口

- `GET /api/photos`
- `POST /api/photos`
- `GET /api/photos/[id]`
- `PATCH /api/photos/[id]`
- `DELETE /api/photos/[id]`
- `GET /api/people`
- `POST /api/people`
- `GET /api/people/[id]`
- `PATCH /api/people/[id]`
- `DELETE /api/people/[id]`
- `GET /api/locations`
- `POST /api/locations`
- `GET /api/events`
- `POST /api/events`
- `GET /api/timeline`
- `GET /api/dashboard`
- `GET /api/export`
- `POST /api/upload`

## 当前环境中的未执行项

本次代码生成发生在一个没有安装 `Node.js`、`npm`、`Docker` 的工作区环境里，因此以下命令我没有实际执行，也没有伪造结果：

- `npm install`
- `npm run lint`
- `npm run build`
- `npx prisma validate`
- `npx prisma migrate dev --name init`
- `npx prisma db seed`
- `docker compose up --build`

你本地在安装好上述工具后，按本 README 顺序执行即可完成真实校验。
