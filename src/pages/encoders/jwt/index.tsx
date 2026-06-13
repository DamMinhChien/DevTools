import { useState, useMemo } from "react";
import ReactJson from "react-json-view";
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

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const { theme } = useAppStore();
  
  const parsed = useMemo(() => parseJwt(input), [input]);
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <phantom-ui loading={false}>
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
        {/* Page Header */}
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Mã hóa & Giải mã
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">JWT Decoder</h2>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block max-w-md text-right">
            Dán JSON Web Token (JWT) để xem nội dung Header và Payload chi tiết.
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
                    vpn_key
                  </span>
                  <span className="font-semibold text-sm">Encoded JWT Token</span>
                </div>
                <button
                  onClick={() => setInput("")}
                  className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete_sweep
                  </span>
                  Xóa
                </button>
              </div>
              
              <textarea
                className="w-full flex-1 min-h-[150px] lg:min-h-0 p-4 font-mono text-base bg-transparent border-none focus:ring-0 resize-none transition-all text-foreground outline-none break-all"
                placeholder="Dán token bắt đầu bằng 'eyJ...' vào đây..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Cột phải: Output Grid */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className={`bg-card border rounded-xl flex flex-col h-full shadow-sm transition-colors ${input && !parsed ? "border-destructive/50" : "border-border"}`}>
              <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-muted/30 shrink-0">
                <span className="material-symbols-outlined text-muted-foreground text-sm">
                  visibility
                </span>
                <span className="font-semibold text-sm text-foreground">Decoded Data</span>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                {!input ? (
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
          </div>

        </div>
      </div>
    </phantom-ui>
  );
}
