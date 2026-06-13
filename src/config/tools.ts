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
      },
      {
        id: "regex-tester",
        name: "Kiểm tra Regex",
        description: "Kiểm tra và kiểm thử biểu thức chính quy (Regular Expressions).",
        icon: "regular_expression",
        color: "bg-purple-500",
        disabled: true,
        keywords: ["regex", "biểu thức", "chính quy", "test", "match"]
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
        id: "hash-generator",
        name: "Hash Generator",
        description: "Tạo mã băm MD5, SHA-1, SHA-256, SHA-512 tức thì.",
        icon: "tag",
        color: "bg-pink-500",
        disabled: false,
        keywords: ["hash", "md5", "sha", "băm", "generator", "tạo"]
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
  }
];

export const allTools = toolCategories.flatMap(c => c.tools);
