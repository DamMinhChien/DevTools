import { useState, useMemo } from "react";
import { diffChars, diffWordsWithSpace, diffLines } from "diff";
import "@aejkatappaja/phantom-ui";

export default function DiffChecker() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [mode, setMode] = useState<"chars" | "words" | "lines">("words");

  const diffResult = useMemo(() => {
    if (!original && !modified) return [];
    
    let result;
    if (mode === "chars") result = diffChars(original, modified);
    else if (mode === "words") result = diffWordsWithSpace(original, modified);
    else result = diffLines(original, modified);

    return result;
  }, [original, modified, mode]);

  return (
    <phantom-ui loading={false}>
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
        {/* Page Header */}
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">subject</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Công cụ Văn bản
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Check Diff Văn bản</h2>
          </div>
          
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setMode("chars")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === "chars" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ký tự
            </button>
            <button
              onClick={() => setMode("words")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === "words" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Từ
            </button>
            <button
              onClick={() => setMode("lines")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === "lines" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dòng
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          
          {/* Input Section (2 textareas side by side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-1/2 min-h-[250px]">
            {/* Original */}
            <div className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm focus-within:border-primary/50 transition-colors">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                <span className="font-semibold text-sm text-destructive">Văn bản gốc</span>
                <button onClick={() => setOriginal("")} className="text-muted-foreground hover:text-destructive"><span className="material-symbols-outlined text-sm">delete</span></button>
              </div>
              <textarea
                className="w-full flex-1 p-4 font-mono text-sm bg-transparent border-none focus:ring-0 resize-none outline-none"
                placeholder="Dán văn bản gốc (Original) vào đây..."
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
              />
            </div>

            {/* Modified */}
            <div className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm focus-within:border-primary/50 transition-colors">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                <span className="font-semibold text-sm text-emerald-500">Văn bản mới</span>
                <button onClick={() => setModified("")} className="text-muted-foreground hover:text-destructive"><span className="material-symbols-outlined text-sm">delete</span></button>
              </div>
              <textarea
                className="w-full flex-1 p-4 font-mono text-sm bg-transparent border-none focus:ring-0 resize-none outline-none"
                placeholder="Dán văn bản đã sửa (Modified) vào đây..."
                value={modified}
                onChange={(e) => setModified(e.target.value)}
              />
            </div>
          </div>

          {/* Result Output */}
          <div className="bg-card border border-border rounded-xl flex flex-col h-1/2 min-h-[250px] shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-muted/30 shrink-0 flex gap-4 text-xs font-mono text-muted-foreground">
              <span className="text-destructive font-semibold">- Xóa bỏ (Đỏ)</span>
              <span className="text-emerald-500 font-semibold">+ Thêm mới (Xanh)</span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed bg-background/50 whitespace-pre-wrap break-words">
              {!original && !modified ? (
                <span className="opacity-30">---</span>
              ) : (
                diffResult.map((part, index) => {
                  const colorClass = part.added 
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                    : part.removed 
                      ? "bg-destructive/20 text-destructive dark:text-red-400 line-through opacity-80" 
                      : "text-foreground";
                  
                  return (
                    <span key={index} className={`rounded-[2px] ${colorClass}`}>
                      {part.value}
                    </span>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </phantom-ui>
  );
}
