import { useState, useEffect } from "react";
import "@aejkatappaja/phantom-ui";

export default function Base64Converter() {
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
        // Handle Unicode properly
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
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
              <span className="material-symbols-outlined text-sm">data_object</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Mã hóa & Giải mã
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Base64 Encoder</h2>
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
              Mã hóa
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mode === "decode"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Giải mã
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
                  <span className="font-semibold text-sm">Đầu vào ({mode === "encode" ? "Text" : "Base64"})</span>
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
                className="w-full flex-1 min-h-[150px] lg:min-h-0 p-4 font-mono text-base bg-transparent border-none focus:ring-0 resize-none transition-all text-foreground outline-none"
                placeholder={`Dán văn bản cần ${mode === "encode" ? "mã hóa" : "giải mã"} vào đây...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Cột phải: Output */}
          <div className="flex flex-col h-full">
            <div className={`bg-card border rounded-xl flex flex-col h-full shadow-sm transition-colors ${error ? "border-destructive/50" : "border-border"}`}>
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="material-symbols-outlined text-muted-foreground text-sm">
                    output
                  </span>
                  <span className="font-semibold text-sm">Kết quả ({mode === "encode" ? "Base64" : "Text"})</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isCopied ? "check" : "content_copy"}
                  </span>
                  {isCopied ? "Đã chép" : "Sao chép"}
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto no-scrollbar font-mono text-base text-foreground break-all">
                {error ? (
                  <span className="text-destructive font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                  </span>
                ) : (
                  output || <span className="opacity-30">---</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </phantom-ui>
  );
}
