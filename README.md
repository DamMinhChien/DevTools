# DevTools

🌍 **Live Demo:** 
- [https://devtoools.tech](https://devtoools.tech)
- [https://dev-tools-chi-one.vercel.app](https://dev-tools-chi-one.vercel.app/)

Dự án này là một ứng dụng Single Page Application (SPA) được xây dựng bằng React và TypeScript, sử dụng Vite làm công cụ build. Mục đích chính của dự án là cung cấp một bộ khung (template) tinh gọn để bạn có thể tự xây dựng và quản lý các công cụ (tools) hỗ trợ công việc cá nhân.

## Các công nghệ cốt lõi

- **Vite + React + TypeScript**: Cung cấp môi trường phát triển cực nhanh và kiểm tra kiểu dữ liệu tĩnh mạnh mẽ.
- **Tailwind CSS**: Framework CSS tiện ích giúp thiết kế giao diện linh hoạt và nhanh chóng.
- **Shadcn UI**: Bộ component UI đẹp mắt, có khả năng tùy biến cao, được xây dựng trên nền tảng Radix UI và Tailwind CSS.
- **Biome**: Công cụ thay thế toàn diện cho ESLint và Prettier, giúp lint và format code với tốc độ cực nhanh.
- **pnpm**: Trình quản lý gói (package manager) hiệu quả, tiết kiệm dung lượng ổ đĩa.

## Cấu trúc thư mục chính

```text
DevTools/
├── public/              # Chứa các tài nguyên tĩnh (assets) không cần qua build
├── src/
│   ├── assets/          # Hình ảnh, icon, font chữ
│   ├── components/      # (Shadcn UI) Các component giao diện dùng chung (Button, Input,...)
│   ├── lib/             # Các hàm tiện ích (utils, formatters, helpers)
│   ├── tools/           # Thư mục chính để bạn tạo các công cụ cá nhân
│   ├── App.tsx          # Component gốc của ứng dụng
│   └── main.tsx         # Điểm khởi chạy của React
├── .agents/             # Cấu hình kỹ năng (skills) cho các Agent AI
├── .cgcignore           # Cấu hình loại trừ cho CodeGraphContext
├── biome.json           # Cấu hình của Biome (linting/formatting)
├── tailwind.config.ts   # Cấu hình Tailwind CSS
└── vite.config.ts       # Cấu hình Vite (đã thiết lập alias @/)
```

## Hướng dẫn sử dụng

### Cài đặt môi trường

Đảm bảo bạn đã cài đặt Node.js (phiên bản 22.x) và pnpm.

```bash
# Cài đặt các thư viện cần thiết
pnpm install
```

### Khởi chạy môi trường phát triển (Development)

```bash
pnpm run dev
```
Sau đó truy cập vào đường dẫn `http://localhost:5173` trên trình duyệt.

### Kiểm tra và định dạng mã nguồn (Lint & Format)

Dự án sử dụng Biome để đảm bảo chất lượng và định dạng mã nguồn:

```bash
# Chạy kiểm tra lỗi (Lint)
pnpm run lint

# Tự động sửa định dạng mã nguồn (Format)
pnpm run format
```

### Xây dựng bản phân phối (Build for Production)

```bash
pnpm run build
```
Thư mục `dist/` sẽ được tạo ra, sẵn sàng để deploy lên các nền tảng như Vercel hoặc GitHub Pages.

## Cách tạo công cụ (tool) mới

1. Tạo một thư mục mới trong `src/tools/` (ví dụ: `src/tools/JsonFormatter/`).
2. Xây dựng giao diện công cụ bằng cách sử dụng các UI component có sẵn trong `src/components/ui/`.
3. Nhúng (import) component công cụ vừa tạo vào `src/App.tsx` hoặc thiết lập thư viện quản lý định tuyến (Routing) nếu ứng dụng của bạn trở nên phức tạp hơn.
