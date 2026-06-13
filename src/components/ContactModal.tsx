import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { useHotkeys } from "react-hotkeys-hook";

export default function ContactModal() {
  const { isContactOpen, setContactOpen } = useAppStore();

  const email = import.meta.env.VITE_CONTACT_EMAIL || "damminhchien220204@gmail.com";
  const subject = encodeURIComponent("[DevTools] Góp ý tính năng / Báo lỗi");
  const body = encodeURIComponent("Xin chào Admin,\n\nTôi muốn báo lỗi hoặc góp ý về tính năng...\n\n[Vui lòng nhập mô tả chi tiết tại đây]");

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${subject}&body=${body}`;
  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

  // Close when pressing Esc
  useHotkeys('esc', () => setContactOpen(false), { enableOnFormTags: true, enabled: isContactOpen });

  return (
    <AnimatePresence>
      {isContactOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactOpen(false)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto flex flex-col relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-border pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">mail</span>
                  </div>
                  <button 
                    onClick={() => setContactOpen(false)}
                    className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
                <h2 className="text-xl font-bold text-foreground">Gửi Góp ý / Báo lỗi</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Chọn ứng dụng Email mà bạn muốn sử dụng để gửi phản hồi. Biểu mẫu sẽ được điền sẵn nội dung.
                </p>
              </div>

              {/* Options */}
              <div className="p-4 space-y-3 bg-muted/20">
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setContactOpen(false)}
                  className="w-full flex items-center p-3 rounded-xl border border-border bg-card hover:border-red-500/50 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">Gmail (Trình duyệt)</h3>
                    <p className="text-xs text-muted-foreground">Mở trực tiếp tab soạn mail của Google</p>
                  </div>
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-red-500">chevron_right</span>
                </a>

                <a
                  href={outlookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setContactOpen(false)}
                  className="w-full flex items-center p-3 rounded-xl border border-border bg-card hover:border-blue-500/50 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Outlook" className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">Outlook (Trình duyệt)</h3>
                    <p className="text-xs text-muted-foreground">Mở trực tiếp tab soạn mail của Microsoft</p>
                  </div>
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-blue-500">chevron_right</span>
                </a>

                <a
                  href={mailtoUrl}
                  onClick={() => setContactOpen(false)}
                  className="w-full flex items-center p-3 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-foreground">desktop_windows</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">Ứng dụng Mặc định</h3>
                    <p className="text-xs text-muted-foreground">Mở Apple Mail, Mail (Windows), v.v...</p>
                  </div>
                  <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
