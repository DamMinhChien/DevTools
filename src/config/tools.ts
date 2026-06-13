export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  disabled: boolean;
  keywords?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  tools: Tool[];
}

export const toolCategories: Category[] = [
  {
    id: "text",
    name: "Công cụ Văn bản",
    icon: "subject",
    tools: [
      {
        id: "case-converter",
        name: "Case Converter",
        description: "Chuyển đổi văn bản sang CamelCase, SnakeCase, v.v...",
        icon: "text_fields",
        color: "bg-blue-500",
        disabled: false,
        keywords: ["case", "chữ hoa", "chữ thường", "camelcase", "snakecase", "kebabcase"]
      },
      {
        id: "diff-checker",
        name: "Diff Checker",
        description: "So sánh và tìm điểm khác biệt giữa 2 đoạn văn bản.",
        icon: "difference",
        color: "bg-indigo-500",
        disabled: false,
        keywords: ["diff", "so sánh", "khác biệt", "compare", "text"]
      }
    ]
  },
  {
    id: "encoders",
    name: "Mã hóa & Giải mã",
    icon: "code",
    tools: [
      {
        id: "base64",
        name: "Base64 Encoder",
        description: "Mã hóa và giải mã chuỗi Base64 dễ dàng.",
        icon: "data_object",
        color: "bg-emerald-500",
        disabled: false,
        keywords: ["base64", "encode", "decode", "mã hóa", "giải mã"]
      },
      {
        id: "url-encoder",
        name: "URL Encoder",
        description: "Mã hóa và giải mã chuỗi URL (encodeURIComponent).",
        icon: "link",
        color: "bg-sky-500",
        disabled: false,
        keywords: ["url", "encode", "decode", "mã hóa", "giải mã", "link"]
      },
      {
        id: "jwt",
        name: "JWT Decoder",
        description: "Giải mã token JWT để xem header và payload.",
        icon: "lock_open",
        color: "bg-purple-500",
        disabled: false,
        keywords: ["jwt", "token", "decode", "giải mã", "json web token", "auth"]
      }
    ]
  },
  {
    id: "generators",
    name: "Trình Tạo Dữ Liệu",
    icon: "autorenew",
    tools: [
      {
        id: "hash-generator",
        name: "Hash Generator",
        description: "Tạo mã băm MD5, SHA-1, SHA-256, SHA-512 tức thì.",
        icon: "tag",
        color: "bg-pink-500",
        disabled: false,
        keywords: ["hash", "md5", "sha", "băm", "generator", "tạo"]
      },
      {
        id: "uuid-generator",
        name: "UUID Generator",
        description: "Sinh mã UUID v4 và v7 ngẫu nhiên với nhiều định dạng.",
        icon: "fingerprint",
        color: "bg-teal-500",
        disabled: false,
      },
      {
        id: "request-builder",
        name: "Request Builder",
        description: "Tạo Payload (JSON/Form) và sinh chuỗi ký HMAC.",
        icon: "api",
        color: "bg-orange-500",
        disabled: false,
        keywords: ["request", "payload", "hmac", "json", "form", "api", "sign"]
      }
    ]
  },
  {
    id: "developer",
    name: "Công cụ Lập trình",
    icon: "terminal",
    tools: [
      {
        id: "code-formatter",
        name: "Code Formatter",
        description: "Format và làm đẹp code JSON, JS, TS, HTML, CSS, Markdown. Hỗ trợ dán code hoặc tải file.",
        icon: "format_align_left",
        color: "bg-violet-500",
        disabled: false,
        keywords: ["format", "prettier", "code", "json", "javascript", "typescript", "html", "css", "markdown", "làm đẹp"]
      },
      {
        id: "timestamp-converter",
        name: "Unix Timestamp",
        description: "Chuyển đổi qua lại giữa Unix Timestamp và Ngày giờ.",
        icon: "schedule",
        color: "bg-rose-500",
        disabled: false,
        keywords: ["time", "timestamp", "unix", "epoch", "date", "ngày giờ"]
      },
      {
        id: "regex-tester",
        name: "Kiểm tra Regex",
        description: "Kiểm tra và kiểm thử biểu thức chính quy (Regular Expressions).",
        icon: "regular_expression",
        color: "bg-purple-500",
        disabled: false,
        keywords: ["regex", "biểu thức", "chính quy", "test", "match"]
      },
      {
        id: "api-tester",
        name: "API Tester (Mini Postman)",
        description: "Gửi HTTP Request, kiểm thử API nhanh chóng ngay trên trình duyệt.",
        icon: "send",
        color: "bg-cyan-500",
        disabled: false,
        keywords: ["api", "postman", "request", "http", "fetch", "axios", "tester", "test"]
      }
    ]
  }
];

export const allTools = toolCategories.flatMap(c => c.tools);
