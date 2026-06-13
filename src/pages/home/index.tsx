import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { toolCategories } from "../../config/tools";

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

  const categories = toolCategories;

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
