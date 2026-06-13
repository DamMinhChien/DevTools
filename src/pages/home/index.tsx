import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { toolCategories } from "../../config/tools";
import { useAppStore } from "../../store/useAppStore";

export default function Home() {
  const navigate = useNavigate();
  const setContactOpen = useAppStore(state => state.setContactOpen);

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
      {/* Header & Intro */}
      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-4">
            {/* Avatar Placeholder */}
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center shrink-0 overflow-hidden">
              <span className="material-symbols-outlined text-3xl text-primary">person</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Chào các đồng âm, tôi là Đàm Minh Chiến 👋</h1>
              <p className="text-primary font-medium">King Of Vibe Coding</p>
            </div>
          </div>
          
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <p>
              Chào mừng đến với <strong>DevTools</strong>! Đây là nơi tôi tổng hợp và xây dựng các công cụ nhỏ bé nhưng có võ, giúp anh em lập trình viên tiết kiệm thời gian xử lý dữ liệu hàng ngày.
            </p>
            <p>
              Fun fact: Dù mang danh xưng hào nhoáng là <i>King Of Vibe Coding</i>, nhưng thực tại tôi chỉ là một <strong>súc vật intern không lương</strong> đang ngày ngày cày cuốc. 🥲
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <button
              onClick={() => setContactOpen(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
              Gửi Góp ý / Báo lỗi
            </button>
            
            <a href="https://github.com/DamMinhChien" target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2 border border-border">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </div>
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
