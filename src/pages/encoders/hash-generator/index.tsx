import { useState } from "react";
import CryptoJS from "crypto-js";
import "@aejkatappaja/phantom-ui";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const charCount = input.length;

  const results = [
    { key: "MD5", value: input ? CryptoJS.MD5(input).toString() : "" },
    { key: "SHA-1", value: input ? CryptoJS.SHA1(input).toString() : "" },
    { key: "SHA-256", value: input ? CryptoJS.SHA256(input).toString() : "" },
    { key: "SHA-512", value: input ? CryptoJS.SHA512(input).toString() : "" },
  ];

  const handleCopy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <phantom-ui loading={false}>
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
        {/* Page Header */}
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">tag</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Mã hóa & Giải mã
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Hash Generator</h2>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block max-w-md text-right">
            Tạo mã băm (Hash) tức thì từ văn bản của bạn. Hỗ trợ MD5, SHA-1, SHA-256, và SHA-512.
          </p>
        </header>

        {/* Bố cục 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          
          {/* Cột trái: Input Section */}
          <div className="flex flex-col h-full">
            <div className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm focus-within:border-primary/50 transition-colors">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="material-symbols-outlined text-muted-foreground text-sm">
                    keyboard
                  </span>
                  <span className="font-semibold text-sm">Văn bản đầu vào</span>
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
                placeholder="Gõ văn bản cần tạo mã băm vào đây..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              
              <div className="px-4 py-2 border-t border-border bg-muted/10 flex justify-between items-center shrink-0">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{charCount} ký tự</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 auto-rows-max overflow-y-auto no-scrollbar pb-4">
            {results.map((res) => (
              <div
                key={res.key}
                onClick={() => handleCopy(res.key, res.value)}
                className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/50 cursor-pointer transition-all group relative flex flex-col min-h-[5rem]"
              >
                <div className="flex justify-between items-start mb-2 shrink-0">
                  <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold group-hover:text-primary transition-colors">
                    {res.key}
                  </h3>
                  <span className={`material-symbols-outlined text-sm transition-all ${
                    copiedKey === res.key ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                  }`}>
                    {copiedKey === res.key ? "check" : "content_copy"}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <p className="font-mono text-sm text-foreground break-all">
                    {res.value || <span className="opacity-30">---</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </phantom-ui>
  );
}
