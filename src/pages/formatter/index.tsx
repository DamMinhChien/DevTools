import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../../components/CodeEditor";
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

interface ParsedError {
  headline: string;   // Tóm tắt ngắn gọn tiếng Việt
  detail: string;     // Raw message gốc từ prettier
  line?: number;
  col?: number;
  snippet?: string;   // Dòng code bị lỗi
}

export default function CodeFormatter() {
  const [mode, setMode] = useState<"paste" | "upload">("paste");
  const [lang, setLang] = useState<string>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [parseError, setParseError] = useState<ParsedError | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Parse error message từ prettier để lấy line/col
  const parsePrettierError = useCallback((err: unknown, code: string): ParsedError => {
    const raw = err instanceof Error ? err.message : "Lỗi không xác định";

    // Prettier thường format: "SyntaxError: Unexpected token X (line:col)"
    const locMatch = raw.match(/(\d+):(\d+)/);
    const line = locMatch ? parseInt(locMatch[1]) : undefined;
    const col = locMatch ? parseInt(locMatch[2]) : undefined;

    // Lấy snippet dòng lỗi
    let snippet: string | undefined;
    if (line !== undefined) {
      const lines = code.split("\n");
      snippet = lines[line - 1]?.trim();
    }

    // Headline tiếng Việt
    let headline = "Không thể format — kiểm tra lại cú pháp";
    if (raw.includes("Unexpected token")) headline = "Token không hợp lệ";
    else if (raw.includes("Unexpected end")) headline = "Thiếu ký tự đóng (dấu }, ], \" ...)";
    else if (raw.includes("Unexpected identifier")) headline = "Tên biến/từ khóa không hợp lệ";
    else if (raw.includes("is not defined")) headline = "Biến chưa được định nghĩa";
    else if (raw.includes("missing")) headline = "Thiếu ký tự bắt buộc";

    return { headline, detail: raw, line, col, snippet };
  }, []);

  // ── Format logic ─────────────────────────────────────────────────────────────
  const handleFormat = useCallback(async (code: string, langKey: string) => {
    if (!code.trim()) return;
    setStatus("loading");
    setParseError(null);

    const cfg = LANG_CONFIGS[langKey];
    if (!cfg) {
      setStatus("error");
      setParseError({ headline: "Ngôn ngữ không được hỗ trợ", detail: "" });
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
      setParseError(parsePrettierError(err, code));
      setOutput("");
    }
  }, [parsePrettierError]);

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
    setParseError(null);
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
              <CodeEditor
                value={input}
                onChange={setInput}
                placeholder={`Dán ${cfg?.label ?? ""} vào đây...`}
                errorLine={status === "error" ? parseError?.line : undefined}
                className="h-80 border-border focus-within:ring-2 focus-within:ring-primary/30"
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
                  <span className={`w-2.5 h-2.5 rounded-full ${status === "error" ? "bg-destructive" : "bg-emerald-500"}`} />
                  <span className="text-sm font-medium text-muted-foreground">Output</span>
                  {status === "success" && (
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                      ✓ Đã format
                    </span>
                  )}
                  {status === "error" && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
                      ✗ Lỗi cú pháp
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
                {status === "error" && parseError ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full p-4 rounded-xl border border-destructive/40 bg-destructive/5 overflow-auto flex flex-col gap-3"
                  >
                    {/* Headline */}
                    <div className="flex items-center gap-2 text-destructive font-semibold">
                      <span className="material-symbols-outlined text-xl shrink-0">error</span>
                      <span>{parseError.headline}</span>
                    </div>

                    {/* Line/col badge */}
                    {parseError.line !== undefined && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-destructive/10 text-destructive font-mono px-2 py-1 rounded-md border border-destructive/20">
                          Dòng {parseError.line}{parseError.col !== undefined ? `, Cột ${parseError.col}` : ""}
                        </span>
                        {parseError.snippet && (
                          <code className="text-xs bg-muted text-muted-foreground font-mono px-2 py-1 rounded-md border border-border truncate max-w-[260px]">
                            {parseError.snippet}
                          </code>
                        )}
                      </div>
                    )}

                    {/* Raw detail (collapsible) */}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
                        Chi tiết lỗi gốc
                      </summary>
                      <pre className="mt-2 font-mono text-destructive/80 whitespace-pre-wrap break-all bg-destructive/5 rounded-md p-2 border border-destructive/20">
                        {parseError.detail}
                      </pre>
                    </details>
                  </motion.div>
                ) : output ? (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    <CodeEditor
                      value={output}
                      readOnly
                      className="h-full border-emerald-500/30"
                    />
                  </motion.div>
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
