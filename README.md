# Flarum Friend Links (友情链接扩展)

一个功能完善的 Flarum 友情链接管理扩展，支持前端展示、用户申请、后台审核以及邮件通知等完整工作流。

## 核心功能 (Features)

### 🎨 前端展示 (Frontend)
- **底部友情链接区域 (Footer Widget)**: 在论坛所有页面底部固定展示已通过审核的友情链接，支持自适应黑夜/白天模式，排版整洁。
- **独立友链展示页 (Standalone Page)**: 提供 `/friend-links` 专属页面，以卡片网格形式展示所有通过审核的链接，并支持“加载更多”无刷新翻页。
- **用户申请弹窗 (Application Modal)**: 注册用户可一键调出申请弹窗。弹窗内会清晰展示“本站信息”（站长在后台配置的名称、链接、LOGO），并对用户提交的网址和图片链接进行格式校验。

### ⚙️ 后台管理 (Admin Panel)
- **基础设置 (Settings)**: 可配置底部最多显示链接数，以及本站的名称、URL 和 LOGO。
- **邮件通知系统 (Email Notifications)**:
  - 支持一键开启/关闭邮件通知。
  - 内置完善的邮件模板变量（如：`{$username}`, `{$userEmail}`, `{$siteName}`, `{$siteUrl}`, `{$reason}` 等）。
  - 支持自定义“新申请通知管理员”、“审核通过通知申请人”、“审核拒绝通知申请人”三种邮件的文本内容。
- **申请列表与审核 (Application Management)**:
  - 后台提供完整的申请列表，展示申请人信息（用户名、邮箱）、网站信息及当前状态。
  - 支持管理员手动**添加**、**编辑**、**删除**友情链接。
  - **审核通过**：一键通过，并自动发送配置好的通过邮件。
  - **审核拒绝**：弹出强制必填的拒绝理由输入框，拒绝后自动将理由附带在邮件中发送给申请人。

## API Endpoints
- `POST /api/friend-links`: Submit an application (requires auth, 10/hour).
- `GET /api/friend-links`: List approved links.
- `PATCH /api/friend-links/:id`: Approve/Reject links (admin only).
- `GET /api/friend-links/settings`: Get settings (admin only).
- `PUT /api/friend-links/settings`: Update settings (admin only).