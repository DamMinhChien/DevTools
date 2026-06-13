import { useState } from "react";
import "@aejkatappaja/phantom-ui";

const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

const toSnakeCase = (str: string) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join("_") || "";
};

const toKebabCase = (str: string) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join("-") || "";
};

const toPascalCase = (str: string) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join("") || "";
};

export default function TextCaseConverter() {
  const [isLoading] = useState(false);
  const [input, setInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const charCount = input.length;
  const wordCount = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;

  const results = [
    { key: "UPPERCASE", value: input.toUpperCase() },
    { key: "lowercase", value: input.toLowerCase() },
    { key: "camelCase", value: toCamelCase(input) },
    { key: "snake_case", value: toSnakeCase(input) },
    { key: "PascalCase", value: toPascalCase(input) },
    { key: "kebab-case", value: toKebabCase(input) },
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
    <phantom-ui loading={isLoading}>
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
        {/* Page Header - Tối giản */}
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">subject</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Công cụ Văn bản
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Chuyển đổi kiểu chữ</h2>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block max-w-md text-right">
            Gõ văn bản để tự động chuyển đổi sang các định dạng code
          </p>
        </header>

        {/* Bố cục 2 cột để tối ưu chiều dọc */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">

          {/* Cột trái: Input Section */}
          <div className="flex flex-col h-full">
            <div className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm">
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
                placeholder="Dán hoặc gõ văn bản của bạn vào đây..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />

              <div className="px-4 py-2 border-t border-border bg-muted/10 flex justify-between items-center shrink-0">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{charCount} ký tự</span>
                  <span>{wordCount} từ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max overflow-y-auto no-scrollbar pb-4">
            {results.map((res) => (
              <div
                key={res.key}
                onClick={() => handleCopy(res.key, res.value)}
                className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/50 cursor-pointer transition-all group relative flex flex-col h-24"
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
                  <p className="font-mono text-sm text-foreground break-words line-clamp-2">
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
