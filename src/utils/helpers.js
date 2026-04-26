export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val))
}

export function formatYear(year) {
  return `Năm ${year}`
}

export function getRatingStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
