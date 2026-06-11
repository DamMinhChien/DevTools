---
name: devtools-frontend-development
description: Hướng dẫn phát triển frontend cho DevTools sử dụng React, Vite, Biome, shadcn/ui và Tailwind CSS.
---

# Phát triển giao diện DevTools

Đây là tài liệu hướng dẫn kỹ năng (SKILL) dành cho dự án **DevTools** (`D:\Project\DevTools`). Dự án này là một SPA (Single Page Application) sử dụng React và TypeScript, được thiết kế tinh gọn để xây dựng các công cụ (tools) cá nhân.

## Mục đích sử dụng

Dự án này là nơi lưu trữ và phát triển các công cụ tiện ích cá nhân, chẳng hạn như:
- Công cụ xử lý văn bản, JSON formatter.
- Công cụ tính toán nhanh.
- Trình quản lý dữ liệu cá nhân đơn giản.

## Ngăn xếp công nghệ (Tech Stack)

| Công nghệ | Mục đích |
|-----------|----------|
| **Vite** + **React** | Build tool và thư viện giao diện UI |
| **TypeScript** | Đảm bảo tính chặt chẽ về kiểu dữ liệu (Type safety) |
| **Biome** | Linting và formatting (thay thế ESLint/Prettier) |
| **shadcn/ui** + **Radix** | Xây dựng các UI component cơ bản (`src/components/ui/`) |
| **Tailwind CSS** | Định kiểu (styling) giao diện tiện lợi |

*Yêu cầu Node.js phiên bản 22.x trở lên.*

## Cấu trúc thư mục tiêu chuẩn

```text
src/
  assets/        # Tài nguyên tĩnh
  components/    # Các component dùng chung (chủ yếu là shadcn/ui)
  lib/           # Hàm tiện ích (utils)
  tools/         # [Quan trọng] Nơi chứa code của các công cụ cá nhân
  App.tsx        # Màn hình chính
  main.tsx       # Entry point
```

**Quy ước import:** Dự án đã được cấu hình alias `@/` trỏ tới thư mục `src/`.
Ví dụ: `import { Button } from "@/components/ui/button"`

## Hướng dẫn tạo công cụ mới

1. **Khởi tạo**: Tạo một thư mục riêng cho công cụ của bạn bên trong `src/tools/` (ví dụ: `src/tools/MyCustomTool`).
2. **Giao diện**: Tận dụng tối đa các thành phần UI có sẵn trong `src/components/ui/` để giữ giao diện nhất quán và tiết kiệm thời gian.
3. **Tích hợp**: Đưa component của công cụ vào `App.tsx` để hiển thị trên trình duyệt.

## Tiêu chuẩn mã nguồn (Code Style)

Dự án sử dụng **Biome** để thay thế cho cả ESLint và Prettier. Đảm bảo mã nguồn luôn tuân thủ tiêu chuẩn trước khi commit:

```bash
pnpm run lint    # Kiểm tra các lỗi trong code
pnpm run format  # Tự động định dạng lại code cho đẹp
pnpm run build   # Build thử nghiệm xem có lỗi TypeScript không
```

## Môi trường phát triển (Dev Workflow)

```bash
cd D:\Project\DevTools

# Cài đặt thư viện
pnpm install

# Chạy server phát triển (chạy ở cổng 5173)
pnpm run dev
```

## Tích hợp CodeGraphContext (CGC)

- **Bỏ qua (Ignore):** Các file và thư mục như `node_modules/`, `dist/` đã được cấu hình loại trừ trong file `.cgcignore`.
- Dùng CGC để nắm bắt toàn bộ ngữ cảnh của kho chứa khi cần agent AI trợ giúp viết các logic phức tạp.
