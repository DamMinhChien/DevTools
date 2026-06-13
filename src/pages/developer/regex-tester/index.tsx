import { useState, useMemo } from "react";
import "@aejkatappaja/phantom-ui";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState("");

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      const flagStr = Object.entries(flags)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join("");
      return { regex: new RegExp(pattern, flagStr), error: null };
    } catch (e: any) {
      return { regex: null, error: e.message };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !testString) return [];
    
    // If not global, matchAll throws or we just use match
    if (!regex.global) {
      const match = testString.match(regex);
      if (!match) return [];
      return [{
        match: match[0],
        index: match.index,
        groups: match.slice(1)
      }];
    }

    try {
      const results = [...testString.matchAll(regex)];
      return results.map(m => ({
        match: m[0],
        index: m.index,
        groups: m.slice(1)
      }));
    } catch (e) {
      // In case of infinite loops or regex issues
      return [];
    }
  }, [regex, testString]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleClear = () => {
    setPattern("");
    setTestString("");
  };

  return (
    <phantom-ui>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">regular_expression</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Công cụ Lập trình
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Kiểm tra Regex</h2>
          </div>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-semibold rounded-md transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            Xóa tất cả
          </button>
        </header>

        {/* Regular Expression Input */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col focus-within:border-primary/50 transition-colors">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">Biểu thức chính quy (Regular Expression)</span>
          </div>
          <div className="flex flex-col md:flex-row items-stretch p-4 gap-4">
            <div className="flex-1 flex items-center bg-muted/50 rounded-lg px-3 py-2 border border-border font-mono">
              <span className="text-muted-foreground mr-1">/</span>
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
                placeholder="Nhập pattern ở đây... (vd: \d+)"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                autoFocus
              />
              <span className="text-muted-foreground ml-1">/</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFlag("g")}
                className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold border transition-colors ${flags.g ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`}
                title="Global search (g)"
              >
                g
              </button>
              <button
                onClick={() => toggleFlag("i")}
                className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold border transition-colors ${flags.i ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`}
                title="Case-insensitive search (i)"
              >
                i
              </button>
              <button
                onClick={() => toggleFlag("m")}
                className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold border transition-colors ${flags.m ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`}
                title="Multi-line search (m)"
              >
                m
              </button>
            </div>
          </div>
          {error && (
            <div className="px-4 pb-4 text-sm text-destructive font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}
        </div>

        {/* Test String & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Test String */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[400px]">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground">Chuỗi cần test (Test String)</span>
            </div>
            <textarea
              className="w-full flex-1 p-4 font-mono text-sm bg-transparent border-none outline-none resize-none text-foreground"
              placeholder="Nhập chuỗi văn bản cần kiểm tra..."
              value={testString}
              onChange={e => setTestString(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[400px]">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground">Kết quả Match</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {matches.length} matches
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!regex && (
                <div className="text-muted-foreground text-sm text-center mt-10">
                  Vui lòng nhập Biểu thức Regex hợp lệ.
                </div>
              )}
              {regex && matches.length === 0 && (
                <div className="text-muted-foreground text-sm text-center mt-10">
                  Không tìm thấy kết quả nào phù hợp (No matches found).
                </div>
              )}
              {matches.map((m, idx) => (
                <div key={idx} className="bg-muted/30 border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-3 py-1.5 border-b border-border text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Match {idx + 1}</span>
                    <span>Index: {m.index}</span>
                  </div>
                  <div className="p-3 font-mono text-sm text-foreground break-all">
                    {m.match}
                  </div>
                  {m.groups.length > 0 && (
                    <div className="px-3 pb-3 space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Capture Groups:</div>
                      {m.groups.map((g, gIdx) => (
                        <div key={gIdx} className="flex gap-2 text-xs font-mono">
                          <span className="text-primary/70 shrink-0">Group {gIdx + 1}:</span>
                          <span className="text-foreground">{g !== undefined ? g : <span className="text-muted-foreground italic">undefined</span>}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </phantom-ui>
  );
}
