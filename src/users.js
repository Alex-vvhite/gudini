export const BANKS = [
  { id: 'tbank', label: 'Т-Банк' },
  { id: 'alfa', label: 'Альфа' },
  { id: 'sber', label: 'Сбер' },
]

export const METHODS = [
  { id: 'card', label: 'Карта' },
  { id: 'sbp', label: 'СБП' },
]

export const CARD_MAX_DIGITS = 18
export const CARD_MIN_DIGITS = 16

export const labelOf = (list, id) => list.find((x) => x.id === id)?.label ?? id

export const onlyDigits = (value) => value.replace(/\D/g, '')

// 8 и 7 в начале — оба российский код, храним всегда с 7.
export function normalizePhone(value) {
  let d = onlyDigits(value)
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (d && !d.startsWith('7')) d = '7' + d
  return d.slice(0, 11)
}

export function formatPhone(digits) {
  if (!digits) return ''
  const d = digits.padEnd(11, ' ')
  const parts = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].map((p) => p.trim())
  let out = '+7'
  if (parts[0]) out += ` (${parts[0]}`
  // Скобку закрываем только когда дальше есть цифры, иначе Backspace по ней не сработает.
  if (parts[1]) out += ')'
  if (parts[1]) out += ` ${parts[1]}`
  if (parts[2]) out += `-${parts[2]}`
  if (parts[3]) out += `-${parts[3]}`
  return out
}

export const formatCard = (digits) => digits.replace(/(\d{4})(?=\d)/g, '$1 ')

// Пользователи пока хранятся только в этом браузере, бэкенда ещё нет.
const STORAGE_KEY = 'gudini.users'

export function loadUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch {
    // Хранилище недоступно (приватный режим) — список просто живёт до перезагрузки.
  }
}
