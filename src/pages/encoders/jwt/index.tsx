import { useState, useMemo } from "react";
import ReactJson from "react-json-view";
import CryptoJS from "crypto-js";
import "@aejkatappaja/phantom-ui";
import { useAppStore } from "../../../store/useAppStore";

function parseJwt(token: string) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64UrlToB64 = (str: string) => str.replace(/-/g, '+').replace(/_/g, '/');
    const decodeB64 = (str: string) => decodeURIComponent(escape(atob(base64UrlToB64(str))));
    return {
      header: JSON.parse(decodeB64(parts[0])),
      payload: JSON.parse(decodeB64(parts[1])),
      signature: parts[2]
    };
  } catch (e) {
    return null;
  }
}

function base64url(source: CryptoJS.lib.WordArray) {
  let encodedSource = CryptoJS.enc.Base64.stringify(source);
  encodedSource = encodedSource.replace(/=+$/, '');
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  return encodedSource;
}

function encodeJwt(header: string, payload: string, secret: string) {
  try {
    // Validate JSON first
    JSON.parse(header);
    JSON.parse(payload);

    const stringifiedHeader = CryptoJS.enc.Utf8.parse(header);
    const encodedHeader = base64url(stringifiedHeader);

    const stringifiedPayload = CryptoJS.enc.Utf8.parse(payload);
    const encodedPayload = base64url(stringifiedPayload);

    const signature = encodedHeader + "." + encodedPayload;
    
    // Default to HS256 for this simple tool
    const signatureBytes = CryptoJS.HmacSHA256(signature, secret);
    const encodedSignature = base64url(signatureBytes);

    return encodedHeader + "." + encodedPayload + "." + encodedSignature;
  } catch(e) {
    return "Lỗi: JSON không hợp lệ!";
  }
}

export default function JwtDecoder() {
  const [mode, setMode] = useState<"encode" | "decode">("decode");
  
  // Decode state
  const [decodeInput, setDecodeInput] = useState("");
  
  // Encode state
  const [encodeHeader, setEncodeHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [encodePayload, setEncodePayload] = useState('{\n  "sub": "1234567890",\n  "name": "DevTools User",\n  "iat": 1516239022\n}');
  const [encodeSecret, setEncodeSecret] = useState('your-256-bit-secret');

  const { theme } = useAppStore();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  const parsed = useMemo(() => parseJwt(decodeInput), [decodeInput]);
  const encodedToken = useMemo(() => encodeJwt(encodeHeader, encodePayload, encodeSecret), [encodeHeader, encodePayload, encodeSecret]);

  return (
    <phantom-ui loading={false}>
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
        {/* Page Header */}
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">lock_open</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Mã hóa & Giải mã
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">JWT Encoder/Decoder</h2>
          </div>
          <div className="flex bg-muted rounded-lg p-1">
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
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mode === "encode"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tạo mã (Encode)
            </button>
          </div>
        </header>

        {/* Bố cục 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          
          {/* Cột trái: Input Section */}
          <div className="flex flex-col h-full overflow-hidden">
            {mode === "decode" ? (
              <div className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm focus-within:border-primary/50 transition-colors">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="material-symbols-outlined text-muted-foreground text-sm">
                      vpn_key
                    </span>
                    <span className="font-semibold text-sm">Encoded JWT Token</span>
                  </div>
                  <button
                    onClick={() => setDecodeInput("")}
                    className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      delete_sweep
                    </span>
                    Xóa
                  </button>
                </div>
                
                <textarea
                  className="w-full flex-1 p-4 font-mono text-base bg-transparent border-none focus:ring-0 resize-none transition-all text-foreground outline-none break-all"
                  placeholder="Dán token bắt đầu bằng 'eyJ...' vào đây..."
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar">
                {/* Header Input */}
                <div className="bg-card border border-border rounded-xl flex flex-col shadow-sm focus-within:border-primary/50 transition-colors shrink-0">
                  <div className="px-4 py-2 border-b border-border bg-muted/30">
                    <span className="font-bold text-xs text-destructive uppercase tracking-widest font-mono">Header (JSON)</span>
                  </div>
                  <textarea
                    className="w-full h-24 p-3 font-mono text-sm bg-transparent border-none focus:ring-0 resize-none outline-none text-foreground"
                    value={encodeHeader}
                    onChange={(e) => setEncodeHeader(e.target.value)}
                  />
                </div>
                {/* Payload Input */}
                <div className="bg-card border border-border rounded-xl flex flex-col shadow-sm focus-within:border-primary/50 transition-colors flex-1 min-h-[150px]">
                  <div className="px-4 py-2 border-b border-border bg-muted/30">
                    <span className="font-bold text-xs text-primary uppercase tracking-widest font-mono">Payload (JSON)</span>
                  </div>
                  <textarea
                    className="w-full flex-1 p-3 font-mono text-sm bg-transparent border-none focus:ring-0 resize-none outline-none text-foreground"
                    value={encodePayload}
                    onChange={(e) => setEncodePayload(e.target.value)}
                  />
                </div>
                {/* Secret Input */}
                <div className="bg-card border border-border rounded-xl flex flex-col shadow-sm focus-within:border-primary/50 transition-colors shrink-0">
                  <div className="px-4 py-2 border-b border-border bg-muted/30">
                    <span className="font-bold text-xs text-emerald-500 uppercase tracking-widest font-mono">Verify Signature (Secret)</span>
                  </div>
                  <input
                    type="text"
                    className="w-full p-3 font-mono text-sm bg-transparent border-none focus:ring-0 outline-none text-foreground"
                    value={encodeSecret}
                    onChange={(e) => setEncodeSecret(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Output Grid */}
          <div className="flex flex-col h-full overflow-hidden">
            {mode === "decode" ? (
              <div className={`bg-card border rounded-xl flex flex-col h-full shadow-sm transition-colors ${decodeInput && !parsed ? "border-destructive/50" : "border-border"}`}>
                <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-muted/30 shrink-0">
                  <span className="material-symbols-outlined text-muted-foreground text-sm">
                    visibility
                  </span>
                  <span className="font-semibold text-sm text-foreground">Decoded Data</span>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                  {!decodeInput ? (
                    <span className="opacity-30 font-mono text-sm">---</span>
                  ) : !parsed ? (
                    <span className="text-destructive font-semibold flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined">error</span>
                      Token không hợp lệ! Vui lòng kiểm tra lại.
                    </span>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-destructive uppercase tracking-widest font-mono">Header</h4>
                        <div className="rounded-lg overflow-hidden border border-border p-2 bg-background">
                          <ReactJson 
                            src={parsed.header} 
                            theme={isDark ? "brewer" : "rjv-default"} 
                            style={{ backgroundColor: 'transparent' }} 
                            enableClipboard={false}
                            displayDataTypes={false}
                            displayObjectSize={false}
                            quotesOnKeys={false}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest font-mono">Payload</h4>
                        <div className="rounded-lg overflow-hidden border border-border p-2 bg-background">
                          <ReactJson 
                            src={parsed.payload} 
                            theme={isDark ? "brewer" : "rjv-default"} 
                            style={{ backgroundColor: 'transparent' }} 
                            enableClipboard={false}
                            displayDataTypes={false}
                            displayObjectSize={false}
                            quotesOnKeys={false}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono">Signature</h4>
                        <div className="rounded-lg border border-border p-3 bg-background">
                          <p className="font-mono text-xs break-all text-muted-foreground">
                            {parsed.signature}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={`bg-card border rounded-xl flex flex-col h-full shadow-sm transition-colors ${encodedToken.startsWith("Lỗi") ? "border-destructive/50" : "border-border"}`}>
                <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="material-symbols-outlined text-muted-foreground text-sm">
                      output
                    </span>
                    <span className="font-semibold text-sm">Encoded JWT</span>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(encodedToken)}
                    className="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Sao chép
                  </button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto font-mono text-base break-all bg-background/50">
                  {encodedToken.startsWith("Lỗi") ? (
                    <span className="text-destructive font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined">error</span>
                      {encodedToken}
                    </span>
                  ) : (
                    <div className="leading-relaxed">
                      <span className="text-destructive">{encodedToken.split('.')[0]}</span>
                      <span className="text-foreground">.</span>
                      <span className="text-primary">{encodedToken.split('.')[1]}</span>
                      <span className="text-foreground">.</span>
                      <span className="text-emerald-500">{encodedToken.split('.')[2]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </phantom-ui>
  );
}
