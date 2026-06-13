import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Plugin } from "prettier";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import parserTypescript from "prettier/plugins/typescript";
import parserHtml from "prettier/plugins/html";
import parserCss from "prettier/plugins/postcss";
import parserMarkdown from "prettier/plugins/markdown";

// ─── Cấu hình ngôn ngữ được hỗ trợ ───────────────────────────────────────────
interface LangConfig {
  label: string;
  parser: string;
  plugins: Plugin[];
  extensions: string[];
  icon: string;
  color: string;
}

const LANG_CONFIGS: Record<string, LangConfig> = {
  json: {
    label: "JSON",
    parser: "json",
    plugins: [parserBabel, parserEstree],
    extensions: [".json"],
    icon: "data_object",
    color: "bg-yellow-500",
  },
  javascript: {
    label: "JavaScript",
    parser: "babel",
    plugins: [parserBabel, parserEstree],
    extensions: [".js", ".mjs", ".cjs", ".jsx"],
    icon: "javascript",
    color: "bg-yellow-400",
  },
  typescript: {
    label: "TypeScript",
    parser: "typescript",
    plugins: [parserTypescript, parserEstree],
    extensions: [".ts", ".tsx", ".mts", ".cts"],
    icon: "code",
    color: "bg-blue-500",
  },
  html: {
    label: "HTML",
    parser: "html",
    plugins: [parserHtml],
    extensions: [".html", ".htm"],
    icon: "html",
    color: "bg-orange-500",
  },
  css: {
    label: "CSS / SCSS",
    parser: "css",
    plugins: [parserCss],
    extensions: [".css", ".scss", ".less"],
    icon: "palette",
    color: "bg-purple-500",
  },
  markdown: {
    label: "Markdown",
    parser: "markdown",
    plugins: [parserMarkdown],
    extensions: [".md", ".mdx"],
    icon: "description",
    color: "bg-teal-500",
  },
};

// Detect language from file extension
function detectLangFromExt(filename: string): string | null {
  const lower = filename.toLowerCase();
  for (const [key, cfg] of Object.entries(LANG_CONFIGS)) {
    if (cfg.extensions.some((ext) => lower.endsWith(ext))) return key;
  }
  return null;
}

// Format status
type Status = "idle" | "loading" | "success" | "error";

export default function CodeFormatter() {
  const [mode, setMode] = useState<"paste" | "upload">("paste");
  const [lang, setLang] = useState<string>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Format logic ─────────────────────────────────────────────────────────────
  const handleFormat = useCallback(async (code: string, langKey: string) => {
    if (!code.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    const cfg = LANG_CONFIGS[langKey];
    if (!cfg) {
      setStatus("error");
      setErrorMsg("Ngôn ngữ không được hỗ trợ.");
      return;
    }

    try {
      const result = await prettier.format(code, {
        parser: cfg.parser,
        plugins: cfg.plugins,
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        printWidth: 100,
      });
      setOutput(result);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Không thể format đoạn mã này.";
      setErrorMsg(msg);
      setOutput("");
    }
  }, []);

  // ── File upload ───────────────────────────────────────────────────────────────
  const handleFileUpload = useCallback(
    async (file: File) => {
      setFileName(file.name);
      const detectedLang = detectLangFromExt(file.name);
      const useLang = detectedLang ?? lang;
      if (detectedLang) setLang(detectedLang);

      const text = await file.text();
      setMode("paste"); // switch to paste mode to show content
      setInput(text);
      await handleFormat(text, useLang);
    },
    [lang, handleFormat]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMsg("");
    setFileName(null);
  }, []);

  const cfg = LANG_CONFIGS[lang];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-primary tracking-tight flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">format_align_left</span>
          Code Formatter
        </h1>
        <p className="text-muted-foreground text-lg">
          Format và làm đẹp code: dán trực tiếp hoặc tải file lên.
        </p>
      </header>

      {/* Mode Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["paste", "upload"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              mode === m
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {m === "paste" ? "content_paste" : "upload_file"}
            </span>
            {m === "paste" ? "Dán code" : "Tải file lên"}
          </button>
        ))}
      </div>

      {/* Language Selector (chỉ hiện ở paste mode) */}
      {mode === "paste" && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(LANG_CONFIGS).map(([key, c]) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                lang === key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      <AnimatePresence mode="wait">
        {mode === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-16 text-center cursor-pointer transition-colors group"
          >
            <span className="material-symbols-outlined text-5xl text-muted-foreground group-hover:text-primary transition-colors">
              cloud_upload
            </span>
            <p className="mt-3 text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Kéo thả file vào đây hoặc click để chọn
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Hỗ trợ: .js, .ts, .tsx, .json, .html, .css, .scss, .md
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".js,.mjs,.cjs,.jsx,.ts,.tsx,.mts,.cts,.json,.html,.htm,.css,.scss,.less,.md,.mdx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Area */}
      <AnimatePresence>
        {(mode === "paste" || input) && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* Input Panel */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg?.color ?? "bg-muted"}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {fileName ? `📄 ${fileName}` : `Input · ${cfg?.label ?? lang}`}
                  </span>
                </div>
                <button
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Xóa
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Dán ${cfg?.label ?? ""} vào đây...`}
                className="w-full h-80 p-4 font-mono text-sm bg-card border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground/50"
              />
              <button
                onClick={() => handleFormat(input, lang)}
                disabled={!input.trim() || status === "loading"}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <motion.span
                      className="material-symbols-outlined text-base"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      progress_activity
                    </motion.span>
                    Đang format...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">auto_fix_high</span>
                    Format
                  </>
                )}
              </button>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-muted-foreground">Output</span>
                  {status === "success" && (
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                      ✓ Đã format
                    </span>
                  )}
                </div>
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

              <div className="relative h-80">
                {status === "error" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full p-4 rounded-xl border border-destructive/40 bg-destructive/5 font-mono text-sm text-destructive overflow-auto whitespace-pre-wrap"
                  >
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-base shrink-0">error</span>
                      <span>{errorMsg}</span>
                    </div>
                  </motion.div>
                ) : output ? (
                  <motion.textarea
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    readOnly
                    value={output}
                    className="w-full h-full p-4 font-mono text-sm bg-card border border-emerald-500/30 rounded-xl resize-none focus:outline-none text-foreground"
                  />
                ) : (
                  <div className="h-full rounded-xl border border-dashed border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground/50">
                      <span className="material-symbols-outlined text-4xl">format_align_left</span>
                      <p className="text-sm mt-2">Output sẽ hiện ở đây</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
