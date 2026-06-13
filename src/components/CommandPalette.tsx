import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useAppStore } from "../store/useAppStore";
import { allTools } from "../config/tools";
import { useHotkeys } from "react-hotkeys-hook";

export default function CommandPalette() {
  const { isSearchOpen, setSearchOpen } = useAppStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when pressing Esc (useHotkeys or native)
  useHotkeys('esc', () => setSearchOpen(false), { enableOnFormTags: true, enabled: isSearchOpen });

  // Filter logic
  const filteredTools = allTools.filter((tool) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(q)))
    );
  });

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTimeout(() => setQuery(""), 200); // Clear query after closing animation
    }
  }, [isSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredTools.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedTool = filteredTools[selectedIndex];
      if (selectedTool && !selectedTool.disabled) {
        navigate({ to: `/${selectedTool.id}` });
        setSearchOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden pointer-events-auto flex flex-col mx-4"
            >
              {/* Search Input */}
              <div className="flex items-center px-4 border-b border-border">
                <span className="material-symbols-outlined text-muted-foreground mr-3">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Bạn muốn tìm công cụ gì? (VD: base64, hash...)"
                  className="w-full bg-transparent py-4 outline-none text-foreground text-lg placeholder:text-muted-foreground"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="px-2 py-1 text-xs text-muted-foreground bg-muted rounded hover:text-foreground hover:bg-muted/80 transition-colors ml-2 font-mono"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredTools.length === 0 ? (
                  <div className="py-14 text-center text-muted-foreground">
                    Không tìm thấy công cụ nào phù hợp với "{query}".
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTools.map((tool, index) => (
                      <div
                        key={tool.id}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => {
                          if (!tool.disabled) {
                            navigate({ to: `/${tool.id}` });
                            setSearchOpen(false);
                          }
                        }}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                          tool.disabled ? "opacity-50 cursor-not-allowed" : ""
                        } ${
                          selectedIndex === index
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 shadow-sm ${
                          selectedIndex === index ? "bg-white/20" : tool.color
                        }`}>
                          <span className={`material-symbols-outlined ${
                            selectedIndex === index ? "text-white" : "text-white"
                          }`}>
                            {tool.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-base ${
                            selectedIndex === index ? "text-primary-foreground" : "text-foreground"
                          }`}>
                            {tool.name}
                          </h4>
                          <p className={`text-sm truncate ${
                            selectedIndex === index ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}>
                            {tool.description}
                          </p>
                        </div>
                        {tool.disabled && (
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                            selectedIndex === index ? "bg-white/20 text-white" : "bg-muted text-muted-foreground border border-border"
                          }`}>
                            Sắp có
                          </span>
                        )}
                        {selectedIndex === index && !tool.disabled && (
                          <span className="material-symbols-outlined text-primary-foreground/60 text-xl">
                            keyboard_return
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
