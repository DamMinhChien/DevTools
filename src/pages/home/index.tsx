import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";

export default function Home() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const categories = [
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
          disabled: false
        },
        {
          id: "diff-checker",
          name: "Diff Checker",
          description: "So sánh và tìm điểm khác biệt giữa 2 đoạn văn bản.",
          icon: "difference",
          color: "bg-indigo-500",
          disabled: false
        },
        {
          id: "regex-tester",
          name: "Kiểm tra Regex",
          description: "Kiểm tra và kiểm thử biểu thức chính quy (Regular Expressions).",
          icon: "regular_expression",
          color: "bg-purple-500",
          disabled: true
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
          disabled: false
        },
        {
          id: "hash-generator",
          name: "Hash Generator",
          description: "Tạo mã băm MD5, SHA-1, SHA-256, SHA-512 tức thì.",
          icon: "tag",
          color: "bg-pink-500",
          disabled: false
        },
        {
          id: "jwt",
          name: "JWT Decoder",
          description: "Giải mã token JWT để xem header và payload.",
          icon: "lock_open",
          color: "bg-purple-500",
          disabled: false
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Trang chủ</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Chào mừng đến với DevTools! Tất cả những công cụ bạn cần để xử lý dữ liệu hàng ngày đều nằm ở đây. Hãy chọn một công cụ bên dưới để bắt đầu.
        </p>
      </header>

      {/* Tool Categories */}
      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id} className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold pb-2 border-b border-border/50">
              <span className="material-symbols-outlined text-primary">{category.icon}</span>
              <h2 className="text-xl">{category.name}</h2>
            </div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {category.tools.map((tool) => (
                <motion.div
                  key={tool.id}
                  variants={item}
                  onClick={() => {
                    if (!tool.disabled) navigate({ to: `/${tool.id}` });
                  }}
                  className={`relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 
                    ${tool.disabled 
                      ? "opacity-60 cursor-not-allowed" 
                      : "cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-1 group"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center shrink-0 shadow-inner`}>
                      <span className="material-symbols-outlined text-white">{tool.icon}</span>
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${!tool.disabled && "group-hover:text-primary transition-colors"}`}>
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {tool.disabled && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                        Sắp có
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </section>
        ))}
      </div>
    </div>
  );
}
