import { useState, useEffect } from "react";
import "@aejkatappaja/phantom-ui";

export default function UrlEncoder() {
  const [isLoading] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    try {
      setError(null);
      if (!input) {
        setOutput("");
        return;
      }
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setOutput("");
      setError("Dữ liệu đầu vào không hợp lệ!");
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <phantom-ui loading={isLoading}>
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
        {/* Page Header */}
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">link</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Mã hóa & Giải mã
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">URL Encoder / Decoder</h2>
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mode === "encode"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mã hóa (Encode)
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mode === "decode"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Giải mã (Decode)
            </button>
          </div>
        </header>

        {/* Layout 2 Cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          
          {/* Cột trái: Input */}
          <div className="flex flex-col h-full">
            <div className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm focus-within:border-primary/50 transition-colors">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="material-symbols-outlined text-muted-foreground text-sm">
                    input
                  </span>
                  <span className="font-semibold text-sm">Đầu vào ({mode === "encode" ? "Text thường" : "URL Encoded"})</span>
                </div>
                <button
                  onClick={handleClear}
                  className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete_sweep
                  </span>
                  Xóa
                </button>
              </div>
              
              <textarea
                className="w-full flex-1 p-4 font-mono text-base bg-transparent border-none focus:ring-0 resize-none transition-all text-foreground outline-none"
                placeholder={mode === "encode" ? "Nhập text cần mã hóa thành URL an toàn..." : "Nhập URL (hoặc text đã mã hóa) cần giải mã..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              
              <div className="px-4 py-2 border-t border-border bg-muted/10 flex justify-between items-center shrink-0">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{input.length} ký tự</span>
                  <span>{new Blob([input]).size} bytes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Output */}
          <div className="flex flex-col h-full">
            <div className={`bg-card border rounded-xl flex flex-col h-full shadow-sm transition-colors relative overflow-hidden ${error ? 'border-destructive/50' : 'border-border'}`}>
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${output ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground'}`}></span>
                  <span className="font-semibold text-sm text-foreground">Kết quả</span>
                </div>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isCopied ? "check" : "content_copy"}
                  </span>
                  {isCopied ? "Đã copy!" : "Copy"}
                </button>
              </div>

              {error ? (
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <span className="material-symbols-outlined text-4xl">error</span>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              ) : (
                <textarea
                  className="w-full flex-1 p-4 font-mono text-base bg-transparent border-none focus:ring-0 resize-none text-foreground outline-none selection:bg-primary/20"
                  value={output}
                  readOnly
                  placeholder="Kết quả sẽ hiển thị ở đây..."
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </phantom-ui>
  );
}
