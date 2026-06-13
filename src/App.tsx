import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "framer-motion";
import TextCaseConverter from "./pages/text/case-converter";
import Base64Converter from "./pages/encoders/base64";
import HashGenerator from "./pages/encoders/hash-generator";
import Home from "./pages/home";

function App() {
  const { theme, setTheme, isSidebarOpen, toggleSidebar, activeToolId, setActiveToolId } = useAppStore();

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

  return (
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
        <div 
          onClick={() => setActiveToolId('home')}
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto no-scrollbar">
          
          <button
            onClick={() => setActiveToolId('home')}
            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors mb-4 group ${
              activeToolId === 'home' 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            } ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
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
          </button>

          {/* Group: Text Tools */}
          <div className="pt-2">
            <AnimatePresence>
              {isSidebarOpen ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-2 py-2 text-xs font-semibold text-primary/60 uppercase tracking-widest overflow-hidden"
                >
                  Công cụ Văn bản
                </motion.div>
              ) : (
                <div className="h-4" /> // Spacer for closed state
              )}
            </AnimatePresence>
            
            <div className="mt-1 space-y-1">
              <button
                onClick={() => setActiveToolId('case-converter')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${
                  activeToolId === 'case-converter' 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
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
              </button>
            </div>
          </div>

          {/* Group: Encoders */}
          <div className="pt-2">
            <AnimatePresence>
              {isSidebarOpen ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-2 py-2 text-xs font-semibold text-primary/60 uppercase tracking-widest overflow-hidden"
                >
                  Mã hóa & Giải mã
                </motion.div>
              ) : (
                <div className="h-4" />
              )}
            </AnimatePresence>
            
            <div className="mt-1 space-y-1">
              <button
                onClick={() => setActiveToolId('base64')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${
                  activeToolId === 'base64' 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
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
              </button>
              
              <button
                onClick={() => setActiveToolId('hash-generator')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${
                  activeToolId === 'hash-generator' 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
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
              </button>
            </div>
          </div>
        </nav>
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

            {/* Global Search Bar */}
            <div className="relative w-full max-w-md hidden sm:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-muted-foreground text-sm">search</span>
              </div>
              <input
                className="w-full bg-muted/50 border border-border rounded-md py-1.5 pl-9 pr-12 text-sm focus-within:ring-1 focus-within:ring-primary transition-all outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="Tìm kiếm công cụ... (⌘K)"
                type="text"
              />
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
          {activeToolId === 'home' && <Home />}
          {activeToolId === 'case-converter' && <TextCaseConverter />}
          {activeToolId === 'base64' && <Base64Converter />}
          {activeToolId === 'hash-generator' && <HashGenerator />}
        </main>
      </motion.div>
    </div>
  );
}

export default App;
