import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import CodeEditor from "../../../components/CodeEditor";
import "@aejkatappaja/phantom-ui";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type BodyType = "none" | "raw" | "form-data";

interface KeyValuePair {
  id: string;
  key: string;
  value: string | File;
  type?: "text" | "file"; // Used for form-data
  enabled: boolean;
}

export default function ApiTester() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Request State
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "auth" | "body">("params");
  const [queryParams, setQueryParams] = useState<KeyValuePair[]>([{ id: uuidv4(), key: "", value: "", enabled: true }]);
  const [headers, setHeaders] = useState<KeyValuePair[]>([{ id: uuidv4(), key: "", value: "", enabled: true }]);
  const [authType, setAuthType] = useState<"none" | "bearer">("none");
  const [bearerToken, setBearerToken] = useState("");
  const [bodyType, setBodyType] = useState<BodyType>("none");
  const [rawBody, setRawBody] = useState("{\n  \n}");
  const [formData, setFormData] = useState<KeyValuePair[]>([{ id: uuidv4(), key: "", value: "", type: "text", enabled: true }]);

  // Response State
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [responseTab, setResponseTab] = useState<"body" | "headers">("body");

  // Helper to manage lists
  const updateList = (list: KeyValuePair[], setter: any, id: string, field: keyof KeyValuePair, val: any) => {
    setter(list.map(item => item.id === id ? { ...item, [field]: val } : item));
  };
  const addToList = (setter: any, extraFields = {}) => {
    setter((prev: any) => [...prev, { id: uuidv4(), key: "", value: "", enabled: true, ...extraFields }]);
  };
  const removeFromList = (list: KeyValuePair[], setter: any, id: string, defaultExtra = {}) => {
    const next = list.filter(item => item.id !== id);
    setter(next.length === 0 ? [{ id: uuidv4(), key: "", value: "", enabled: true, ...defaultExtra }] : next);
  };

  const handleSend = async () => {
    if (!url) return;
    setIsLoading(true);
    setResponse(null);
    setResponseError(null);
    const startTime = Date.now();

    try {
      // 1. Build Query Params
      const paramsObj: Record<string, string> = {};
      queryParams.forEach(p => {
        if (p.enabled && p.key.trim() !== "") paramsObj[p.key] = String(p.value);
      });

      // 2. Build Headers
      const headersObj: Record<string, string> = {};
      headers.forEach(h => {
        if (h.enabled && h.key.trim() !== "") headersObj[h.key] = String(h.value);
      });

      // 3. Auth
      if (authType === "bearer" && bearerToken) {
        headersObj["Authorization"] = `Bearer ${bearerToken}`;
      }

      // 4. Body
      let data: any = undefined;
      if (method !== "GET" && method !== "DELETE") {
        if (bodyType === "raw") {
          headersObj["Content-Type"] = "application/json";
          try {
            data = JSON.parse(rawBody);
          } catch (e) {
            data = rawBody; // Send as raw string if not JSON
          }
        } else if (bodyType === "form-data") {
          const fd = new FormData();
          formData.forEach(fdItem => {
            if (fdItem.enabled && fdItem.key.trim() !== "") {
              fd.append(fdItem.key, fdItem.value as string | Blob);
            }
          });
          data = fd;
        }
      }

      const config: AxiosRequestConfig = {
        method,
        url,
        params: paramsObj,
        headers: headersObj,
        data,
      };

      const res = await axios(config);
      setResponse(res);
      setResponseTime(Date.now() - startTime);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setResponse(error.response);
      } else {
        setResponseError(error.message || "Network Error or CORS issues");
      }
      setResponseTime(Date.now() - startTime);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Key-Value Editor Table
  const renderKeyValueTable = (
    list: KeyValuePair[], 
    setter: any, 
    showTypeSelect = false
  ) => {
    return (
      <div className="space-y-2">
        {list.map(item => (
          <div key={item.id} className="flex items-center gap-2 group">
            <input 
              type="checkbox" 
              checked={item.enabled}
              onChange={() => updateList(list, setter, item.id, "enabled", !item.enabled)}
              className="w-4 h-4 cursor-pointer accent-primary shrink-0"
            />
            <input 
              type="text" 
              value={item.key}
              onChange={e => updateList(list, setter, item.id, "key", e.target.value)}
              placeholder="Key"
              className="w-1/3 bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
            />
            
            {showTypeSelect && (
              <select
                value={item.type || "text"}
                onChange={e => updateList(list, setter, item.id, "type", e.target.value)}
                className="w-24 bg-muted/50 border border-border rounded-md px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
              >
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
            )}

            {item.type === "file" ? (
              <input 
                type="file" 
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    updateList(list, setter, item.id, "value", e.target.files[0]);
                  }
                }}
                className="flex-1 text-sm text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            ) : (
              <input 
                type="text" 
                value={item.value as string}
                onChange={e => updateList(list, setter, item.id, "value", e.target.value)}
                placeholder="Value"
                className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
              />
            )}

            <button 
              onClick={() => removeFromList(list, setter, item.id, showTypeSelect ? { type: "text" } : {})}
              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
        <button
          onClick={() => addToList(setter, showTypeSelect ? { type: "text" } : {})}
          className="mt-2 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold rounded transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          Thêm
        </button>
      </div>
    );
  };

  // Response size format
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getResponseSize = () => {
    if (!response || !response.data) return "---";
    const str = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    return formatSize(new Blob([str]).size);
  };

  return (
    <phantom-ui loading={isLoading}>
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4 relative">
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">send</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Công cụ Lập trình
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">API Tester (Mini Postman)</h2>
          </div>
        </header>

        {/* TOP: Request Config */}
        <div className="flex flex-col gap-4">
          {/* URL Bar */}
          <div className="flex items-stretch h-12 bg-card border border-border rounded-xl shadow-sm overflow-hidden focus-within:border-primary/50 transition-colors">
            <select 
              value={method}
              onChange={e => setMethod(e.target.value as HttpMethod)}
              className="bg-muted/30 border-r border-border px-4 font-bold text-sm outline-none cursor-pointer"
              style={{
                color: method === "GET" ? "#10b981" : method === "POST" ? "#eab308" : method === "PUT" ? "#3b82f6" : method === "DELETE" ? "#ef4444" : "#a855f7"
              }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input 
              type="text" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Nhập URL (vd: https://jsonplaceholder.typicode.com/todos/1)"
              className="flex-1 bg-transparent px-4 font-mono text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button 
              onClick={handleSend}
              disabled={!url || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Gửi
            </button>
          </div>

          {/* Request Tabs Area */}
          <div className="bg-card border border-border rounded-xl shadow-sm min-h-[200px] flex flex-col">
            <div className="flex items-center gap-6 px-4 border-b border-border bg-muted/30 shrink-0">
              {([
                { id: "params", label: "Params" },
                { id: "auth", label: "Auth" },
                { id: "headers", label: "Headers" },
                { id: "body", label: "Body" }
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
              {activeTab === "params" && renderKeyValueTable(queryParams, setQueryParams)}
              
              {activeTab === "headers" && renderKeyValueTable(headers, setHeaders)}
              
              {activeTab === "auth" && (
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <label className="text-sm font-semibold text-foreground">Type:</label>
                    <select 
                      value={authType}
                      onChange={e => setAuthType(e.target.value as "none" | "bearer")}
                      className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm outline-none text-foreground"
                    >
                      <option value="none">No Auth</option>
                      <option value="bearer">Bearer Token</option>
                    </select>
                  </div>
                  {authType === "bearer" && (
                    <div className="max-w-xl">
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Token</label>
                      <input 
                        type="text" 
                        value={bearerToken}
                        onChange={e => setBearerToken(e.target.value)}
                        placeholder="Nhập Token..."
                        className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "body" && (
                <div className="h-full flex flex-col">
                  {method === "GET" && (
                    <div className="text-muted-foreground text-sm italic mb-2">
                      Lưu ý: GET request thường không gửi Body.
                    </div>
                  )}
                  <div className="flex gap-4 items-center mb-3">
                    {([
                      { id: "none", label: "none" },
                      { id: "raw", label: "raw (JSON)" },
                      { id: "form-data", label: "form-data" }
                    ] as const).map(bt => (
                      <label key={bt.id} className="flex items-center gap-1.5 cursor-pointer text-sm font-medium text-foreground">
                        <input 
                          type="radio" 
                          name="bodyType"
                          value={bt.id}
                          checked={bodyType === bt.id}
                          onChange={() => setBodyType(bt.id)}
                          className="accent-primary w-4 h-4 cursor-pointer"
                        />
                        {bt.label}
                      </label>
                    ))}
                  </div>

                  {bodyType === "raw" && (
                    <div className="flex-1 border border-border rounded-lg overflow-hidden min-h-[200px]">
                      <CodeEditor 
                        value={rawBody}
                        onChange={v => setRawBody(v || "")}
                      />
                    </div>
                  )}

                  {bodyType === "form-data" && renderKeyValueTable(formData, setFormData, true)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM: Response Area */}
        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-[350px] overflow-hidden">
          {/* Response Header Info */}
          <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className="text-foreground">Response</span>
              {response && (
                <>
                  <span className={`px-2 py-0.5 rounded-md ${response.status >= 200 && response.status < 300 ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
                    Status: {response.status} {response.statusText}
                  </span>
                  <span className="text-muted-foreground">Time: <span className="text-primary">{responseTime} ms</span></span>
                  <span className="text-muted-foreground">Size: <span className="text-primary">{getResponseSize()}</span></span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setResponseTab("body")}
                className={`text-sm font-semibold transition-colors ${responseTab === "body" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Body
              </button>
              <button
                onClick={() => setResponseTab("headers")}
                className={`text-sm font-semibold transition-colors ${responseTab === "headers" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Headers
              </button>
            </div>
          </div>

          {/* Response Content */}
          <div className="flex-1 relative bg-background/50">
            {!response && !responseError ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                <span className="material-symbols-outlined text-4xl opacity-50">send</span>
                <span className="text-sm font-medium">Nhập URL và bấm Gửi để xem Response</span>
              </div>
            ) : responseError ? (
              <div className="p-6 text-destructive flex flex-col gap-2">
                <div className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  Lỗi Gửi Request
                </div>
                <div className="font-mono text-sm bg-destructive/10 p-4 rounded-lg">
                  {responseError}
                </div>
                <div className="text-sm text-muted-foreground mt-2 italic">
                  * Nếu API không bị chết, có thể do lỗi CORS (Trình duyệt chặn request đến domain không cho phép).
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 overflow-hidden">
                {responseTab === "body" && (
                  <CodeEditor 
                    value={typeof response?.data === 'string' ? response.data : JSON.stringify(response?.data, null, 2)}
                    readOnly
                  />
                )}
                {responseTab === "headers" && (
                  <div className="p-4 h-full overflow-y-auto bg-muted/10">
                    <table className="w-full text-sm text-left">
                      <tbody>
                        {Object.entries(response?.headers || {}).map(([k, v], idx) => (
                          <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-2 px-2 font-semibold text-foreground w-1/3 break-all">{k}</td>
                            <td className="py-2 px-2 font-mono text-muted-foreground break-all">{String(v)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </phantom-ui>
  );
}
