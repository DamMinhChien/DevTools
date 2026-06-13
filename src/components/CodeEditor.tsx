import { useRef, useCallback, useEffect } from "react";

interface CodeEditorProps {
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  errorLine?: number; // highlight dòng lỗi
}

export default function CodeEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = "",
  errorLine,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = value ? value.split("\n") : [];
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll giữa gutter và textarea
  const handleScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Khi value thay đổi, scroll gutter theo
  useEffect(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [value]);

  // Tab key support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newVal = value.substring(0, start) + "  " + value.substring(end);
        onChange?.(newVal);
        // Restore cursor after state update
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div
      className={`relative flex overflow-hidden rounded-xl border bg-card font-mono text-sm ${
        className
      }`}
    >
      {/* Line Numbers Gutter */}
      <div
        ref={gutterRef}
        aria-hidden
        className="overflow-hidden shrink-0 select-none bg-muted/60 border-r border-border/60 py-4 text-right"
        style={{ width: "3rem" }}
      >
        {Array.from({ length: lineCount }, (_, i) => {
          const lineNum = i + 1;
          const isError = errorLine === lineNum;
          return (
            <div
              key={lineNum}
              className={`px-2 leading-6 text-xs transition-colors ${
                isError
                  ? "bg-destructive/20 text-destructive font-bold"
                  : "text-muted-foreground/50"
              }`}
              style={{ lineHeight: "1.5rem" }}
            >
              {lineNum}
            </div>
          );
        })}
        {/* Padding bottom to match textarea */}
        <div className="h-4" />
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={!readOnly ? handleKeyDown : undefined}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        className={`flex-1 resize-none bg-transparent py-4 pl-3 pr-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-6 ${
          readOnly ? "cursor-text" : ""
        }`}
        style={{ lineHeight: "1.5rem", minHeight: "100%" }}
      />
    </div>
  );
}
