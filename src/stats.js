// Данные для статистики на стартовом экране.
//
// Реальных операций пока нет: юзеры в группах не принимают деньги, а заявок на выплату
// ещё нет. Поэтому loadDailyTotals отдаёт демо-ряд с пометкой demo: true. Когда появится
// источник (бэкенд или записи в браузере), он подключается здесь, а график не меняется.

export const SERIES = [
  { key: 'received', label: 'Принято', hint: 'по всем группам', color: '#9171f8' },
  { key: 'paid', label: 'Выплачено', hint: 'в выплатах', color: '#0ea5c6' },
]

export const PERIODS = [
  { days: 7, label: '7 дней' },
  { days: 30, label: '30 дней' },
  { days: 90, label: '90 дней' },
]

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_DAYS = Math.max(...PERIODS.map((p) => p.days))

// Простой генератор с зерном: демо-график одинаковый при каждом открытии.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

// Местная дата YYYY-MM-DD. toISOString не подходит: он переводит в UTC и в Москве
// после полуночи сдвигает день назад.
const toIsoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function demoTotals() {
  const rand = seeded(42)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: MAX_DAYS }, (_, i) => {
    const date = new Date(today.getTime() - (MAX_DAYS - 1 - i) * DAY_MS)
    const trend = 180_000 + i * 1_800
    const weekend = [0, 6].includes(date.getDay()) ? 0.7 : 1
    const received = Math.round((trend + rand() * 90_000) * weekend / 100) * 100
    const paid = Math.round((received * (0.78 + rand() * 0.17)) / 100) * 100
    return { date: toIsoDay(date), received, paid }
  })
}

export function loadDailyTotals(days) {
  return { demo: true, rows: demoTotals().slice(-days) }
}

const rub = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})
const rubCompact = new Intl.NumberFormat('ru-RU', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatRub = (n) => rub.format(n)
export const formatRubCompact = (n) => (n === 0 ? '0' : `${rubCompact.format(n)} ₽`)

const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const fullDayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })

const parseDay = (iso) => new Date(`${iso}T00:00:00`)
export const formatDay = (iso) => dayFormat.format(parseDay(iso)).replace('.', '')
export const formatFullDay = (iso) => fullDayFormat.format(parseDay(iso))
