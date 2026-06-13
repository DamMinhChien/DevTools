import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import hmacSHA256 from "crypto-js/hmac-sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import hmacMD5 from "crypto-js/hmac-md5";
import CodeEditor from "../../../components/CodeEditor";
import "@aejkatappaja/phantom-ui";

interface Param {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export default function RequestBuilder() {
  const [params, setParams] = useState<Param[]>([
    { id: uuidv4(), key: "", value: "", enabled: true }
  ]);
  const [outputFormat, setOutputFormat] = useState<"json" | "form">("json");
  
  // HMAC State
  const [secretKey, setSecretKey] = useState("");
  const [hmacAlgo, setHmacAlgo] = useState<"sha256" | "sha512" | "md5">("sha256");

  const handleAddParam = () => {
    setParams(prev => [...prev, { id: uuidv4(), key: "", value: "", enabled: true }]);
  };

  const handleRemoveParam = (id: string) => {
    setParams(prev => {
      const next = prev.filter(p => p.id !== id);
      return next.length === 0 ? [{ id: uuidv4(), key: "", value: "", enabled: true }] : next;
    });
  };

  const handleParamChange = (id: string, field: "key" | "value", val: string) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const handleToggleParam = (id: string) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const activeParams = useMemo(() => params.filter(p => p.enabled && p.key.trim() !== ""), [params]);

  const generatedPayload = useMemo(() => {
    if (activeParams.length === 0) return outputFormat === "json" ? "{}" : "";
    
    if (outputFormat === "json") {
      const obj = activeParams.reduce((acc, p) => {
        acc[p.key] = p.value;
        return acc;
      }, {} as Record<string, string>);
      return JSON.stringify(obj, null, 2);
    } else {
      // form-urlencoded
      return activeParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
    }
  }, [activeParams, outputFormat]);

  const hmacSignature = useMemo(() => {
    if (!secretKey) return "";
    
    // Thuật toán: 
    // 1. Loại bỏ value rỗng (empty/null)
    // 2. Sắp xếp key theo alphabet
    // 3. Nối bằng dấu & (vd: a=1&b=2)
    const validParams = activeParams.filter(p => p.value.trim() !== "");
    
    // Sort
    validParams.sort((a, b) => a.key.localeCompare(b.key));
    
    // Build string to sign
    const stringToSign = validParams.map(p => `${p.key}=${p.value}`).join("&");
    if (!stringToSign) return "";

    try {
      let hash;
      switch (hmacAlgo) {
        case "sha256": hash = hmacSHA256(stringToSign, secretKey); break;
        case "sha512": hash = hmacSHA512(stringToSign, secretKey); break;
        case "md5": hash = hmacMD5(stringToSign, secretKey); break;
      }
      return hash.toString(); // Hex string
    } catch (e) {
      return "Lỗi khi sinh HMAC";
    }
  }, [activeParams, secretKey, hmacAlgo]);

  const handleCopy = (text: string) => {
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <phantom-ui>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">api</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Trình Tạo Dữ Liệu
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Request Builder & HMAC</h2>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cột trái: Params Config */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[500px]">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex justify-between items-center shrink-0">
                <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">list_alt</span>
                  Dữ liệu (Params / Body)
                </span>
                <button
                  onClick={handleAddParam}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Thêm dòng
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {params.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 group">
                    <input 
                      type="checkbox" 
                      checked={p.enabled}
                      onChange={() => handleToggleParam(p.id)}
                      className="w-4 h-4 cursor-pointer accent-primary"
                    />
                    <input 
                      type="text" 
                      value={p.key}
                      onChange={e => handleParamChange(p.id, "key", e.target.value)}
                      placeholder="Key"
                      className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
                    />
                    <span className="text-muted-foreground">=</span>
                    <input 
                      type="text" 
                      value={p.value}
                      onChange={e => handleParamChange(p.id, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
                    />
                    <button 
                      onClick={() => handleRemoveParam(p.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* HMAC Config */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 space-y-3">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                Cấu hình HMAC Signature
              </h3>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Secret Key</label>
                  <input 
                    type="password" 
                    value={secretKey}
                    onChange={e => setSecretKey(e.target.value)}
                    placeholder="Nhập Secret Key..."
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                  />
                </div>
                <div className="w-32 space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Thuật toán</label>
                  <select 
                    value={hmacAlgo}
                    onChange={e => setHmacAlgo(e.target.value as any)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                  >
                    <option value="sha256">SHA-256</option>
                    <option value="sha512">SHA-512</option>
                    <option value="md5">MD5</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                * Note: Thuật toán đang áp dụng: Sắp xếp key theo bảng chữ cái, bỏ qua value rỗng, nối chuỗi bằng "&" và băm với Secret Key.
              </p>
            </div>
          </div>

          {/* Cột phải: Output */}
          <div className="space-y-4">
            {/* Payload Output */}
            <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[350px]">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex justify-between items-center shrink-0">
                <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">output</span>
                  Kết quả Payload
                </span>
                <div className="flex gap-2 items-center">
                  <select 
                    value={outputFormat}
                    onChange={e => setOutputFormat(e.target.value as "json" | "form")}
                    className="bg-transparent border border-border rounded text-xs px-2 py-1 text-foreground"
                  >
                    <option value="json">application/json</option>
                    <option value="form">x-www-form-urlencoded</option>
                  </select>
                  <button 
                    onClick={() => handleCopy(generatedPayload)}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center p-1"
                    title="Copy payload"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <CodeEditor 
                  value={generatedPayload} 
                  readOnly 
                />
              </div>
            </div>

            {/* HMAC Output */}
            <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-[134px]">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex justify-between items-center shrink-0">
                <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  HMAC Signature
                </span>
                <button 
                  onClick={() => handleCopy(hmacSignature)}
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center p-1"
                  title="Copy signature"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center bg-muted/10">
                {!secretKey ? (
                  <span className="text-muted-foreground text-sm italic">Vui lòng nhập Secret Key để sinh chữ ký...</span>
                ) : (
                  <span className="font-mono text-lg text-primary break-all text-center">
                    {hmacSignature || "---"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </phantom-ui>
  );
}
