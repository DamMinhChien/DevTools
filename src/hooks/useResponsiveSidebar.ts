import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export function useResponsiveSidebar() {
  const { setSidebarOpen } = useAppStore();

  useEffect(() => {
    // Chỉ chạy 1 lần khi component mount
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile: mặc định đóng hoàn toàn
        setSidebarOpen(false);
      } else if (width < 1024) {
        // Tablet: mặc định đóng (thu nhỏ thành icon)
        setSidebarOpen(false);
      } else {
        // Desktop: mặc định mở
        setSidebarOpen(true);
      }
    };

    // Khởi tạo ban đầu
    handleResize();

    // Tùy chọn: Bỏ comment nếu muốn tự động thu/phóng mỗi khi resize cửa sổ
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);
}
