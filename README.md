# AI-Integrated Human Resource & Recruitment Management System

Hệ thống được tổ chức theo kiến trúc microservices nhẹ gồm các thành phần chính:

- **Web (Next.js)**: giao diện bảng điều khiển hợp nhất dành cho HRBP, Talent Acquisition và lãnh đạo. Ứng dụng hiển thị pipeline tuyển dụng, hiệu suất nhân sự, matching AI và insight tự động.
- **API Gateway (NestJS)**: cung cấp REST API tập trung, tổng hợp dữ liệu nhân sự và kích hoạt các tính năng AI mô phỏng như candidate matching, interview feedback và workforce analytics.
- **Worker & AI service**: sẵn sàng mở rộng cho các tác vụ nền (BullMQ, phân tích AI chuyên sâu) và tích hợp mô hình máy học tùy chỉnh.

## Luồng dữ liệu tổng quan

1. Web app gửi yêu cầu tới API Gateway (port 4000) để lấy dữ liệu nhân sự, tuyển dụng và insight AI.
2. API Gateway xử lý dữ liệu trong bộ nhớ (có thể thay bằng database/LLM thật) và trả về kết quả đã được tính toán, bao gồm các đề xuất AI.
3. Worker/AI service (hiện là stub) được thiết kế để triển khai các pipeline tính điểm, phân tích CV hoặc đồng bộ dữ liệu với hệ thống bên ngoài.

## Endpoints chính

| Endpoint | Mô tả |
| --- | --- |
| `GET /employees` | Danh sách nhân sự cùng thông tin năng lực |
| `GET /employees/:id/performance` | Phân tích hiệu suất, lộ trình phát triển và học tập AI gợi ý |
| `GET /candidates` | Pipeline ứng viên cùng điểm AI |
| `GET /jobs` | Danh sách vị trí kèm candidate match score |
| `GET /analytics` | Số liệu tổng quan: headcount, time-to-fill, kỹ năng hot |
| `GET /ai/insights` | Insight chiến lược về workforce stability, automation, upskilling |
| `POST /ai/candidate-summary` | Sinh bản tóm tắt ứng viên (career/culture/skills focus) |
| `POST /ai/match` | Tính điểm matching giữa ứng viên và vị trí |
| `POST /ai/interview-feedback` | Chuẩn hóa nhận xét phỏng vấn và đề xuất hành động |

## Cấu trúc thư mục

```
apps/
├─ web/                # Next.js dashboard
│  └─ src/app/admin    # Trang điều khiển chính
├─ api-gateway/        # NestJS API
│  └─ src/hr           # Module HR & AI logic
├─ ai-service/         # Python service stub để mở rộng AI pipelines
└─ worker/             # Worker nền (BullMQ) - hiện là stub
```

## Chạy cục bộ

```bash
pnpm install

# Khởi động API Gateway
pnpm --filter api-gateway dev

# Khởi động web dashboard
pnpm --filter web dev
```

API mặc định lắng nghe ở `http://localhost:4000`, web ở `http://localhost:3000`. Có thể cấu hình biến `NEXT_PUBLIC_API_URL` để trỏ tới môi trường khác.

## Phát triển tiếp theo

- Kết nối Prisma tới cơ sở dữ liệu thực, đồng bộ dữ liệu nhân sự.
- Triển khai hàng đợi BullMQ trong `worker` để chạy scoring theo lịch.
- Tích hợp mô hình GenAI (OpenAI/Azure) trong `ai-service` để sinh insight phong phú hơn.
- Bổ sung xác thực và RBAC cho API Gateway.