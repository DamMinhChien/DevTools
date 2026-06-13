import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  
  isContactOpen: boolean;
  setContactOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),

      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

      isContactOpen: false,
      setContactOpen: (open) => set({ isContactOpen: open }),
    }),
    {
      name: "devtools-storage", // name of item in the storage (must be unique)
    }
  )
);
