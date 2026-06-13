import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import CommandPalette from "./components/CommandPalette";
import ContactModal from "./components/ContactModal";

function App() {
  const { theme, setTheme, isSidebarOpen, toggleSidebar, setSearchOpen, setContactOpen } = useAppStore();
  const location = useLocation();

  // Handle Dark mode sync
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  // Hotkey to toggle sidebar (Ctrl+B or Cmd+B)
  useHotkeys('mod+b', (e) => {
    e.preventDefault();
    toggleSidebar();
  });

  // Hotkey to open search (Ctrl+K or Cmd+K)
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setSearchOpen(true);
  });

  let pageTitle = "Trang chủ";
  if (location.pathname === '/case-converter') pageTitle = "Chuyển đổi kiểu chữ";
  else if (location.pathname === '/diff-checker') pageTitle = "Diff Checker";
  else if (location.pathname === '/base64') pageTitle = "Base64 Encoder";
  else if (location.pathname === '/hash-generator') pageTitle = "Hash Generator";
  else if (location.pathname === '/jwt') pageTitle = "JWT Encoder/Decoder";

  return (
    <>
      <Helmet>
        <title>{pageTitle} | DevTools</title>
      </Helmet>
      <div className="flex h-screen bg-background text-foreground font-display overflow-hidden">
        {/* Sidebar */}
        <motion.aside 
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed left-0 top-0 h-full bg-card border-r border-border shadow-sm flex flex-col py-4 z-40 ${
            isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-16"
          }`}
        >
          {/* Brand Header */}
          <Link 
            to="/"
            className={`px-4 mb-6 flex items-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden whitespace-nowrap ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
          >
            <motion.div layout className="w-8 h-8 shrink-0 bg-primary rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-foreground text-xl">
                terminal
              </span>
            </motion.div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-xl font-bold text-foreground leading-none">DevTools</h1>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto no-scrollbar">
            
            <Link
              to="/"
              className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors mb-4 group ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
              activeProps={{ className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
              title="Trang chủ"
            >
              <motion.span layout className="material-symbols-outlined shrink-0 text-lg">home</motion.span>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="truncate"
                  >
                    Trang chủ
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Group: Text Tools */}
            <div className="pt-2">
              <div className="px-2 py-2 flex items-center h-8 text-blue-600 dark:text-blue-500 font-bold uppercase tracking-widest text-xs">
                <span className={`material-symbols-outlined shrink-0 text-[18px] ${isSidebarOpen ? "mr-2" : "mx-auto"}`} title="Công cụ Văn bản">text_snippet</span>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      Công cụ Văn bản
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mt-1 space-y-1">
                <Link
                  to="/case-converter"
                  className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
                  activeProps={{ className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" }}
                  inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                  title="Chuyển đổi kiểu chữ"
                >
                  <motion.span layout className="material-symbols-outlined shrink-0 text-lg">text_fields</motion.span>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        Chuyển đổi kiểu chữ
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                <Link
                  to="/diff-checker"
                  className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
                  activeProps={{ className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" }}
                  inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                  title="Diff Checker"
                >
                  <motion.span layout className="material-symbols-outlined shrink-0 text-lg">difference</motion.span>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        Diff Checker
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </div>
            </div>

            {/* Group: Encoders */}
            <div className="pt-2">
              <div className="px-2 py-2 flex items-center h-8 text-blue-600 dark:text-blue-500 font-bold uppercase tracking-widest text-xs">
                <span className={`material-symbols-outlined shrink-0 text-[18px] ${isSidebarOpen ? "mr-2" : "mx-auto"}`} title="Mã hóa & Giải mã">lock</span>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      Mã hóa & Giải mã
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mt-1 space-y-1">
                <Link
                  to="/base64"
                  className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
                  activeProps={{ className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" }}
                  inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                  title="Base64 Encoder"
                >
                  <motion.span layout className="material-symbols-outlined shrink-0 text-lg">data_object</motion.span>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        Base64 Encoder
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                
                <Link
                  to="/hash-generator"
                  className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
                  activeProps={{ className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" }}
                  inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                  title="Hash Generator"
                >
                  <motion.span layout className="material-symbols-outlined shrink-0 text-lg">tag</motion.span>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        Hash Generator
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                <Link
                  to="/jwt"
                  className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
                  activeProps={{ className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" }}
                  inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                  title="JWT Decoder"
                >
                  <motion.span layout className="material-symbols-outlined shrink-0 text-lg">lock_open</motion.span>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        JWT Decoder
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </div>
            </div>
          </nav>

          {/* Feedback / Contact */}
          <div className="p-4 border-t border-border mt-auto shrink-0">
            <button 
              onClick={() => setContactOpen(true)}
              className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group text-muted-foreground hover:bg-primary/10 hover:text-primary ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
              title="Gửi Email Góp ý"
            >
              <span className="material-symbols-outlined shrink-0 text-lg">mail</span>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="truncate font-semibold"
                  >
                    Gửi Góp ý
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.aside>

        {/* Main Content Shell */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`flex flex-col h-screen w-full ${
            isSidebarOpen ? "md:ml-64" : "md:ml-16"
          }`}
        >
          {/* Top Bar Component */}
          <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border flex justify-between items-center px-4 md:px-8 h-16 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              {/* Sidebar Toggle Button */}
              <button 
                onClick={toggleSidebar}
                className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                title="Đóng/Mở Sidebar (Cmd+B)"
              >
                <span className="material-symbols-outlined">
                  {isSidebarOpen ? "menu_open" : "menu"}
                </span>
              </button>

              {/* Global Search Bar (Fake trigger) */}
              <div 
                className="relative w-full max-w-md hidden sm:block group cursor-pointer"
                onClick={() => setSearchOpen(true)}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-muted-foreground text-sm">search</span>
                </div>
                <div className="w-full bg-muted/50 border border-border rounded-md py-1.5 pl-9 pr-3 text-sm text-muted-foreground transition-all group-hover:bg-muted group-hover:border-border/80 flex items-center justify-between">
                  <span>Tìm kiếm công cụ...</span>
                  <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-muted rounded-md transition-colors group flex items-center justify-center"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Chế độ Sáng/Tối"
              >
                <motion.span 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: theme === "dark" ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="material-symbols-outlined text-muted-foreground group-hover:text-primary"
                >
                  {theme === "dark" ? "light_mode" : "dark_mode"}
                </motion.span>
              </button>
            </div>
          </header>

          {/* Tool Viewport */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
            <Outlet />
          </main>
        </motion.div>
      </div>

      {/* Global Modals */}
      <CommandPalette />
      <ContactModal />
    </>
  );
}

export default App;
