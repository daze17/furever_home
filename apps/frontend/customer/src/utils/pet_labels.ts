// Species labels and emojis
export const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  fish: "🐠",
  other: "🐾",
};

export const speciesLabel: Record<string, string> = {
  dog: "Нохой",
  cat: "Муур",
  bird: "Шувуу",
  fish: "Загас",
  other: "Бусад",
};

// Size labels
export const sizeLabel: Record<string, string> = {
  small: "Жижиг",
  medium: "Дунд",
  large: "Том",
};

// Pet status labels and colors
export const petStatusLabel: Record<string, string> = {
  adopting: "Үрчлүүлэх",
  has_owner: "Эзэнтэй",
  inactive: "Идэвхгүй",
};

export const petStatusColors: Record<string, string> = {
  adopting: "bg-green-100 text-green-700",
  has_owner: "bg-blue-100 text-blue-700",
  inactive: "bg-gray-100 text-gray-600",
};

// Adoption post status labels and colors
export const postStatusLabel: Record<string, string> = {
  active: "Идэвхтэй",
  inactive: "Идэвхгүй",
  pending: "Хүлээгдэж буй",
};

export const postStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
};
