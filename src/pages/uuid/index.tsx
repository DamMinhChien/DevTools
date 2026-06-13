import { useState, useCallback } from "react";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

type UuidVersion = "v4" | "v7";

export default function UuidGenerator() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [quantity, setQuantity] = useState<number>(1);
  const [outputs, setOutputs] = useState([
    { key: "Chuẩn (Có gạch nối)", value: "" },
    { key: "In hoa (UPPERCASE)", value: "" },
    { key: "Không gạch nối", value: "" },
    { key: "Trong ngoặc nhọn", value: "" }
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    const std = [];
    const upp = [];
    const nod = [];
    const brc = [];
    for (let i = 0; i < quantity; i++) {
      const rawUuid = version === "v4" ? uuidv4() : uuidv7();
      std.push(rawUuid);
      upp.push(rawUuid.toUpperCase());
      nod.push(rawUuid.replace(/-/g, ""));
      brc.push(`{${rawUuid}}`);
    }
    setOutputs([
      { key: "Chuẩn (Có gạch nối)", value: std.join("\n") },
      { key: "In hoa (UPPERCASE)", value: upp.join("\n") },
      { key: "Không gạch nối", value: nod.join("\n") },
      { key: "Trong ngoặc nhọn", value: brc.join("\n") }
    ]);
  }, [version, quantity]);

  const handleCopy = useCallback((key: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outputs.map((res) => (
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
                {res.value ? (
                  <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all">
                    {res.value}
                  </pre>
                ) : (
                  <span className="opacity-30 font-mono text-sm">---</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
