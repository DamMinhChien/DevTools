import { useEffect, useState } from "react";
import { useAppStore } from "./store/useAppStore";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useMatches } from "@tanstack/react-router";
import { useSwipeable } from "react-swipeable";
import { useResponsiveSidebar } from "./hooks/useResponsiveSidebar";
import CommandPalette from "./components/CommandPalette";
import ContactModal from "./components/ContactModal";
import FallingEffect from "./components/FallingEffect";
import { toolCategories } from "./config/tools";

function App() {
  const { theme, setTheme, isSidebarOpen, toggleSidebar, setSidebarOpen, setSearchOpen, setContactOpen, isFallingEffectActive, toggleFallingEffect } = useAppStore();
  const matches = useMatches();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Apply responsive default states
  useResponsiveSidebar();

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => setSidebarOpen(true),
    onSwipedLeft: () => setSidebarOpen(false),
    trackMouse: false,
    delta: 50 // Minimum swipe distance
  });

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



  // Lấy title từ staticData của route con cuối cùng (deepest match)
  const currentMatch = matches[matches.length - 1];
  const pageTitle = (currentMatch?.staticData?.title as string) || "DevTools";

  return (
    <>
      <Helmet>
        <title>{pageTitle} | DevTools</title>
      </Helmet>
      <div {...swipeHandlers} className="flex h-screen bg-background text-foreground font-display overflow-hidden">
        
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside 
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed left-0 top-0 h-full bg-card border-r border-border shadow-sm flex flex-col py-4 z-40 ${
            isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-16"
          }`}
        >
          {/* Drag Handle (Desktop/Tablet) */}
          {isSidebarOpen && (
            <motion.div
              drag="x"
              dragConstraints={{ left: -100, right: 0 }}
              dragElastic={0}
              onDrag={(_, info) => {
                if (info.offset.x < -15) {
                  setSidebarOpen(false);
                }
              }}
              className="absolute -right-2 top-0 w-4 h-full cursor-col-resize flex items-center justify-center group z-50 hidden md:flex"
            >
              {/* Visual indicator line */}
              <div className="w-1 h-12 bg-border/50 group-hover:bg-primary rounded-full transition-colors" />
            </motion.div>
          )}

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

            {toolCategories.map(category => {
              const isCollapsed = collapsedGroups[category.id];
              return (
                <div key={category.id} className="pt-2">
                  <div 
                    onClick={() => toggleGroup(category.id)}
                    className="px-2 py-2 flex items-center h-8 text-blue-600 dark:text-blue-500 font-bold uppercase tracking-widest text-xs cursor-pointer hover:bg-muted/50 rounded-lg transition-colors group/header"
                  >
                    <span className={`material-symbols-outlined shrink-0 text-[18px] ${isSidebarOpen ? "mr-2" : "mx-auto"}`} title={category.name}>{category.icon}</span>
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span 
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden whitespace-nowrap flex-1"
                        >
                          {category.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isSidebarOpen && (
                      <span className="material-symbols-outlined text-[16px] text-muted-foreground opacity-0 group-hover/header:opacity-100 transition-opacity">
                        {isCollapsed ? "expand_more" : "expand_less"}
                      </span>
                    )}
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 space-y-1 overflow-hidden"
                      >
                        {category.tools.map(tool => (
                          <Link
                            key={tool.id}
                            to={`/${tool.id}`}
                            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors group ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
                            activeProps={{ className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" }}
                            inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                            title={tool.name}
                          >
                            <motion.span layout className="material-symbols-outlined shrink-0 text-lg">{tool.icon}</motion.span>
                            <AnimatePresence>
                              {isSidebarOpen && (
                                <motion.span 
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="truncate"
                                >
                                  {tool.name}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Feedback / Contact */}
          <div className="border-t border-border mt-auto shrink-0">
            <button 
              onClick={() => setContactOpen(true)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors group text-muted-foreground hover:bg-primary/10 hover:text-primary ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}`}
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
          className={`flex flex-col h-screen flex-1 min-w-0 ${
            isSidebarOpen ? "md:ml-64" : "md:ml-16"
          }`}
        >
          {/* Top Bar Component */}
          <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border flex justify-between items-center px-4 md:px-8 h-16 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              {/* Sidebar Toggle Button */}
              <button 
                onClick={toggleSidebar}
                className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground hidden md:block"
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
              <motion.button
                className={`p-2 rounded-md transition-colors flex items-center justify-center text-xl relative ${
                  isFallingEffectActive
                    ? "bg-primary/10 ring-2 ring-primary/40"
                    : "hover:bg-muted"
                }`}
                onClick={toggleFallingEffect}
                title={isFallingEffectActive ? "Tắt hiệu ứng rơi" : "Bật hiệu ứng rơi"}
                whileTap={{ scale: 0.85 }}
                animate={isFallingEffectActive ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {import.meta.env.VITE_FALLING_EMOJIS?.split(",")[0]?.trim() || "🍂"}
              </motion.button>
              
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

      {/* Falling Effect Overlay */}
      <FallingEffect active={isFallingEffectActive} />
    </>
  );
}

export default App;
