import { useState, useCallback } from "react";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

import CodeEditor from "../../components/CodeEditor";

type UuidVersion = "v4" | "v7";


export default function UuidGenerator() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [quantity, setQuantity] = useState<number>(1);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    let result = "";
    for (let i = 0; i < quantity; i++) {
      const rawUuid = version === "v4" ? uuidv4() : uuidv7();
      if (quantity > 1) {
        result += `// --- UUID ${i + 1} ---\n`;
      }
      result += `${rawUuid} (Standard)\n`;
      result += `${rawUuid.toUpperCase()} (Uppercase)\n`;
      result += `${rawUuid.replace(/-/g, "")} (No dashes)\n`;
      result += `{${rawUuid}} (Braces)\n\n`;
    }
    setOutput(result.trimEnd());
  }, [version, quantity]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-primary tracking-tight flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">tag</span>
          UUID Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Sinh tự động UUID phiên bản 4 (Random) và phiên bản 7 (Time-based).
        </p>
      </header>

      {/* Controls */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-4 rounded-xl border border-border">
        {/* Version */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-muted-foreground">Phiên bản</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value as UuidVersion)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
          >
            <option value="v4">UUID v4 (Random)</option>
            <option value="v7">UUID v7 (Time-based)</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-muted-foreground">Số lượng</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="1000"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) setQuantity(Math.min(Math.max(val, 1), 1000));
              }}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
            />
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">autorenew</span>
              Sinh
            </button>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Kết quả
          </h2>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? "check" : "content_copy"}
            </span>
            {copied ? "Đã copy!" : "Copy"}
          </button>
        </div>

        <div className="relative h-96">
          <CodeEditor
            value={output}
            readOnly
            className="h-full border-emerald-500/30"
            placeholder="Nhấn Sinh để tạo UUID..."
          />
        </div>
      </div>
    </div>
  );
}
