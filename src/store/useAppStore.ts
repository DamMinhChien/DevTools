import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  activeToolId: string | null;
  setActiveToolId: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),

      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      activeToolId: "home",
      setActiveToolId: (id) => set({ activeToolId: id }),
    }),
    {
      name: "devtools-storage", // name of item in the storage (must be unique)
    }
  )
);
