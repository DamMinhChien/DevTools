export const fallingEffectConfig = {
  // Thay đổi mảng này tùy theo mùa.
  // Ví dụ mùa xuân: ["🌸", "🌱", "🦋"]
  // Mùa hè: ["☀️", "🍉", "🌊"]
  // Mùa thu: ["🍂", "🍁"]
  // Mùa đông: ["❄️", "⛄", "🎄"]
  // Halloween: ["🎃", "👻", "🦇"]
  emojis: ["🍂", "🍁", "🍄"], // Hiện tại đang setup mùa thu

  // Thời gian rơi (ms)
  duration: 4000,

  // Kích thước emoji
  scalar: 3,
};
