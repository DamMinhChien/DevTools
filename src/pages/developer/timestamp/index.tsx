import { useState, useEffect } from "react";
import "@aejkatappaja/phantom-ui";

export default function TimestampConverter() {
  const [timestampStr, setTimestampStr] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateObj, setDateObj] = useState<Date | null>(new Date());
  
  // Local datetime string for datetime-local input
  const [localDateTimeStr, setLocalDateTimeStr] = useState<string>("");

  useEffect(() => {
    if (!timestampStr) {
      setDateObj(null);
      return;
    }
    
    const tsNum = Number(timestampStr);
    if (isNaN(tsNum)) {
      setDateObj(null);
      return;
    }

    // Auto-detect seconds vs milliseconds
    // 10 digits or less -> seconds
    // 13 digits -> ms
    const isSeconds = timestampStr.length <= 10;
    const finalTs = isSeconds ? tsNum * 1000 : tsNum;
    
    const d = new Date(finalTs);
    if (d.toString() === "Invalid Date") {
      setDateObj(null);
    } else {
      setDateObj(d);
      // Format to YYYY-MM-DDThh:mm for datetime-local input
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      setLocalDateTimeStr(`${year}-${month}-${day}T${hours}:${mins}`);
    }
  }, [timestampStr]);

  const handleSetNow = () => {
    setTimestampStr(Math.floor(Date.now() / 1000).toString());
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalDateTimeStr(val);
    if (!val) return;
    
    const d = new Date(val);
    if (d.toString() !== "Invalid Date") {
      // Set to seconds
      setTimestampStr(Math.floor(d.getTime() / 1000).toString());
    }
  };

  const formatDate = (d: Date | null, type: 'local' | 'utc' | 'iso') => {
    if (!d) return "---";
    switch (type) {
      case 'local':
        return d.toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'long' });
      case 'utc':
        return d.toUTCString();
      case 'iso':
        return d.toISOString();
    }
  };

  return (
    <phantom-ui>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-end justify-between border-b border-border/50 pb-2 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-secondary-foreground font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Công cụ Lập trình
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Unix Timestamp Converter</h2>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timestamp to Date */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">123</span>
              Timestamp sang Ngày giờ
            </h3>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={timestampStr}
                onChange={(e) => setTimestampStr(e.target.value)}
                placeholder="Nhập timestamp (vd: 1718290000)"
                className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-2 font-mono text-sm outline-none focus:border-primary/50 text-foreground transition-colors"
              />
              <button 
                onClick={handleSetNow}
                className="px-4 py-2 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors whitespace-nowrap"
              >
                Hiện tại (Now)
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="bg-muted/30 border border-border rounded-lg p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Local Time (Giờ địa phương)</div>
                <div className="font-medium text-foreground">{formatDate(dateObj, 'local')}</div>
              </div>
              <div className="bg-muted/30 border border-border rounded-lg p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">UTC Time</div>
                <div className="font-medium text-foreground">{formatDate(dateObj, 'utc')}</div>
              </div>
              <div className="bg-muted/30 border border-border rounded-lg p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">ISO 8601</div>
                <div className="font-mono text-sm text-foreground">{formatDate(dateObj, 'iso')}</div>
              </div>
            </div>
          </div>

          {/* Date to Timestamp */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
              Ngày giờ sang Timestamp
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground">Chọn ngày giờ (Local Time)</label>
              <input 
                type="datetime-local" 
                value={localDateTimeStr}
                onChange={handleDateTimeChange}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 font-mono text-sm outline-none focus:border-primary/50 text-foreground transition-colors"
              />
            </div>

            <div className="pt-2">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Unix Timestamp (Seconds)</div>
                <div className="font-mono text-2xl font-bold text-foreground">
                  {dateObj ? Math.floor(dateObj.getTime() / 1000) : "---"}
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="bg-muted/30 border border-border rounded-lg p-4 text-center">
                <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Timestamp (Milliseconds)</div>
                <div className="font-mono text-lg font-semibold text-foreground">
                  {dateObj ? dateObj.getTime() : "---"}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </phantom-ui>
  );
}
