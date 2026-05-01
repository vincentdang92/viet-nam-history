// src/services/storageService.js

const SAVE_KEY_PREFIX = 'minh_chu_save_'

/**
 * Lấy save key dựa trên user ID.
 * Nếu chưa đăng nhập, mặc định là 'guest'.
 */
function getSaveKey(userId = 'guest') {
  return `${SAVE_KEY_PREFIX}${userId}`
}

/**
 * Lưu state hiện tại vào LocalStorage.
 * Tương lai: Thêm logic đồng bộ Firebase tại đây.
 */
export function saveGame(state, userId = 'guest') {
  try {
    const key = getSaveKey(userId)
    const serializedState = JSON.stringify(state)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    console.error('Không thể lưu game:', err)
  }
}

/**
 * Tải state từ LocalStorage.
 * Tương lai: Tải từ Firebase nếu có mạng, fallback LocalStorage nếu offline.
 */
export function loadGame(userId = 'guest') {
  try {
    const key = getSaveKey(userId)
    const serializedState = localStorage.getItem(key)
    if (serializedState === null) {
      return null
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Không thể tải game:', err)
    return null
  }
}

/**
 * Xóa save game (dùng khi "Chơi Lại Từ Đầu").
 */
export function clearGame(userId = 'guest') {
  try {
    const key = getSaveKey(userId)
    localStorage.removeItem(key)
  } catch (err) {
    console.error('Không thể xóa game:', err)
  }
}
