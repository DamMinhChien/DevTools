import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import { useHotkeys } from "react-hotkeys-hook";
import TextCaseConverter from "./pages/text/case-converter";
import Base64Converter from "./pages/encoders/base64";
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
      <aside 
        className={`fixed left-0 top-0 h-full bg-card border-r border-border shadow-sm flex flex-col py-4 z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-16"
        }`}
      >
        {/* Brand Header */}
        <div 
          onClick={() => setActiveToolId('home')}
          className={`px-4 mb-6 flex items-center cursor-pointer hover:opacity-80 transition-opacity ${isSidebarOpen ? "justify-start gap-3" : "justify-center"} overflow-hidden whitespace-nowrap`}
        >
          <div className="w-8 h-8 shrink-0 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-foreground text-xl">
              terminal
            </span>
          </div>
          <div className={`transition-all duration-200 ${isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}>
            <h1 className="text-xl font-bold text-foreground leading-none">DevTools</h1>
          </div>
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
            <span className="material-symbols-outlined shrink-0 text-lg">home</span>
            <span className={`truncate transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}>
              Trang chủ
            </span>
          </button>

          {/* Group: Text Tools */}
          <div className="pt-2">
            <div className={`px-2 py-2 text-xs font-semibold text-primary/60 uppercase tracking-widest transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}>
              Công cụ Văn bản
            </div>
            
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
                <span className="material-symbols-outlined shrink-0 text-lg">text_fields</span>
                <span className={`truncate transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}>
                  Chuyển đổi kiểu chữ
                </span>
              </button>
            </div>
          </div>

          {/* Group: Encoders */}
          <div className="pt-2">
            <div className={`px-2 py-2 text-xs font-semibold text-primary/60 uppercase tracking-widest transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}>
              Mã hóa & Giải mã
            </div>
            
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
                <span className="material-symbols-outlined shrink-0 text-lg">data_object</span>
                <span className={`truncate transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}>
                  Base64 Encoder
                </span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Shell */}
      <div 
        className={`flex flex-col h-screen w-full transition-all duration-300 ease-in-out ${
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
              <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
          </div>
        </header>

        {/* Tool Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
          {activeToolId === 'home' && <Home />}
          {activeToolId === 'case-converter' && <TextCaseConverter />}
          {activeToolId === 'base64' && <Base64Converter />}
        </main>
      </div>
    </div>
  );
}

export default App;
