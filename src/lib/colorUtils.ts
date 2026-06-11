/**
 * Returns a consistent, vibrant color based on the input text.
 * The same text will always return the same color.
 */
export function getVibrantColor(text: string | null | undefined): string {
  if (!text) return '#94a3b8'; // slate-400 default

  const colors = [
    '#6366f1', // Indigo 500
    '#8b5cf6', // Violet 500
    '#ec4899', // Pink 500
    '#f43f5e', // Rose 500
    '#ef4444', // Red 500
    '#f97316', // Orange 500
    '#f59e0b', // Amber 500
    '#eab308', // Yellow 500
    '#84cc16', // Lime 500
    '#22c55e', // Green 500
    '#10b981', // Emerald 500
    '#06b6d4', // Cyan 500
    '#0ea5e9', // Sky 500
    '#3b82f6', // Blue 500
    '#4f46e5', // Indigo 600
    '#7c3aed', // Violet 600
    '#d946ef', // Fuchsia 500
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Returns a subtle background color based on the vibrant color.
 */
export function getSubtleColor(hex: string, opacity: number = 0.1): string {
  // Simple check for hex format
  if (!hex.startsWith('#')) return hex;
  
  // Convert opacity (0-1) to hex (00-ff)
  const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
  
  return `${hex}${hexOpacity}`; 
}
