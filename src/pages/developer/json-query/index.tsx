import { useState, useEffect } from "react";
import CodeEditor from "../../../components/CodeEditor";
import { SimpleTooltip } from "../../../components/ui/tooltip";

export default function JsonQueryConverter() {
  const [jsonValue, setJsonValue] = useState("{\n  \"page\": \"1\",\n  \"limit\": \"10\",\n  \"tags\": [\n    \"news\",\n    \"sports\"\n  ]\n}");
  const [queryValue, setQueryValue] = useState("page=1&limit=10&tags=news&tags=sports");
  const [lastEdited, setLastEdited] = useState<"json" | "query">("json");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lastEdited === "json") {
      try {
        if (!jsonValue.trim()) {
          setQueryValue("");
          setError(null);
          return;
        }
        const obj = JSON.parse(jsonValue);
        const params = new URLSearchParams();
        
        Object.keys(obj).forEach(key => {
          const val = obj[key];
          if (Array.isArray(val)) {
            val.forEach(v => params.append(key, typeof v === 'object' ? JSON.stringify(v) : String(v)));
          } else if (typeof val === 'object' && val !== null) {
            params.append(key, JSON.stringify(val));
          } else if (val !== undefined && val !== null) {
            params.append(key, String(val));
          }
        });
        
        setQueryValue(params.toString());
        setError(null);
      } catch (e: any) {
        setError(e.message || "Invalid JSON");
      }
    }
  }, [jsonValue, lastEdited]);

  useEffect(() => {
    if (lastEdited === "query") {
      try {
        if (!queryValue.trim()) {
          setJsonValue("{}");
          setError(null);
          return;
        }
        const qStr = queryValue.trim().replace(/^\?/, "");
        const params = new URLSearchParams(qStr);
        const obj: Record<string, any> = {};
        
        params.forEach((val, key) => {
          if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key])) {
              obj[key] = [obj[key]];
            }
            obj[key].push(val);
          } else {
            obj[key] = val;
          }
        });
        
        setJsonValue(JSON.stringify(obj, null, 2));
        setError(null);
      } catch (e: any) {
        setError(e.message || "Invalid Query String");
      }
    }
  }, [queryValue, lastEdited]);

  const handleJsonChange = (val: string) => {
    setLastEdited("json");
    setJsonValue(val);
  };

  const handleQueryChange = (val: string) => {
    setLastEdited("query");
    setQueryValue(val);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">sync_alt</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Công cụ Lập trình
            </span>
          </div>
          <h2 className="text-3xl font-bold text-primary">JSON ↔ Query String</h2>
          <p className="text-muted-foreground mt-1">
            Chuyển đổi 2 chiều tự động. Mảng sẽ tự động biến thành các query trùng key (vd: tags=1&tags=2).
          </p>
        </div>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg font-mono text-sm border border-destructive/20 shrink-0 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-0">
        {/* JSON Panel */}
        <div className="flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">data_object</span>
              JSON Object
            </h3>
            <div className="flex items-center gap-2">
              <SimpleTooltip content="Format JSON" side="top">
                <button 
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(jsonValue);
                      setJsonValue(JSON.stringify(parsed, null, 2));
                      setLastEdited("json");
                    } catch {}
                  }}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-background rounded-md border border-border shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">format_align_left</span>
                </button>
              </SimpleTooltip>
              <SimpleTooltip content="Copy" side="top">
                <button 
                  onClick={() => copyToClipboard(jsonValue)}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-background rounded-md border border-border shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </SimpleTooltip>
              <SimpleTooltip content="Clear" side="top">
                <button 
                  onClick={() => handleJsonChange("{}")}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-background rounded-md border border-border shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </SimpleTooltip>
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px]">
            <CodeEditor 
              value={jsonValue}
              onChange={(v) => handleJsonChange(v || "")}
            />
          </div>
        </div>

        {/* Query String Panel */}
        <div className="flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">link</span>
              Query String
            </h3>
            <div className="flex items-center gap-2">
              <SimpleTooltip content="Copy" side="top">
                <button 
                  onClick={() => copyToClipboard(queryValue)}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-background rounded-md border border-border shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </SimpleTooltip>
              <SimpleTooltip content="Clear" side="top">
                <button 
                  onClick={() => handleQueryChange("")}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-background rounded-md border border-border shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </SimpleTooltip>
            </div>
          </div>
          <div className="flex-1 p-4 bg-background/50 overflow-y-auto">
            <textarea
              value={queryValue}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Nhập Query String (vd: a=1&b=2)..."
              className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/50 leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
