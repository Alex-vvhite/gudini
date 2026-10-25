import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const HEIGHT = 300
const MARGIN = { top: 16, right: 96, bottom: 32, left: 64 }
const LABEL_GAP = 16

// Округляет максимум вверх до «красивого» числа и делит ось на ровные шаги.
function niceTicks(max, count = 4) {
  if (max <= 0) return [0, 1]
  const rough = max / count
  const pow = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough)
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
}

// Подписи на концах линий не должны налезать друг на друга.
function spreadLabels(items, min, max) {
  const sorted = [...items].sort((a, b) => a.y - b.y)
  for (let i = 1; i < sorted.length; i++) {
    sorted[i].y = Math.max(sorted[i].y, sorted[i - 1].y + LABEL_GAP)
  }
  const overflow = sorted.at(-1)?.y - max
  if (overflow > 0) sorted.forEach((s) => (s.y -= overflow))
  sorted.forEach((s) => (s.y = Math.max(s.y, min)))
  return items
}

function useWidth(ref) {
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return width
}

export default function LineChart({ rows, series, formatValue, formatAxis, formatX, formatXFull }) {
  const wrapRef = useRef(null)
  const width = useWidth(wrapRef)
  const [hover, setHover] = useState(null)

  useEffect(() => setHover(null), [rows])

  const compact = width < 520
  const margin = compact ? { ...MARGIN, right: 16, left: 64 } : MARGIN
  const plotW = Math.max(0, width - margin.left - margin.right)
  const plotH = HEIGHT - margin.top - margin.bottom

  const maxValue = Math.max(0, ...rows.flatMap((r) => series.map((s) => r[s.key])))
  const ticks = niceTicks(maxValue)
  const yMax = ticks.at(-1)

  const x = (i) => margin.left + (rows.length > 1 ? (i / (rows.length - 1)) * plotW : plotW / 2)
  const y = (v) => margin.top + plotH - (v / yMax) * plotH

  const xTickCount = Math.max(2, Math.min(rows.length, Math.floor(plotW / 90)))
  const xTicks = Array.from({ length: xTickCount }, (_, k) =>
    Math.round((k / (xTickCount - 1)) * (rows.length - 1)),
  ).filter((v, i, a) => a.indexOf(v) === i)

  const path = (key) =>
    rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r[key]).toFixed(1)}`).join('')

  const last = rows.length - 1
  const endLabels = compact
    ? []
    : spreadLabels(
        series.map((s) => ({ ...s, y: y(rows[last][s.key]) })),
        margin.top,
        margin.top + plotH,
      )

  const onPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left - margin.left
    const i = Math.round((px / plotW) * (rows.length - 1))
    setHover(Math.min(last, Math.max(0, i)))
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') setHover((h) => Math.min(last, (h ?? -1) + 1))
    else if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? last + 1) - 1))
    else if (e.key === 'Escape') setHover(null)
    else return
    e.preventDefault()
  }

  const tooltipLeft = hover !== null && x(hover) > width / 2

  return (
    <div className="chart" ref={wrapRef}>
      {width > 0 && rows.length > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`График: ${series.map((s) => s.label).join(' и ')} по дням`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onBlur={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                className={t === 0 ? 'chart__baseline' : 'chart__grid'}
                x1={margin.left}
                x2={margin.left + plotW}
                y1={y(t)}
                y2={y(t)}
              />
              <text className="chart__axis" x={margin.left - 10} y={y(t)} dy="0.32em" textAnchor="end">
                {formatAxis(t)}
              </text>
            </g>
          ))}

          {xTicks.map((i) => (
            <text
              key={i}
              className="chart__axis"
              x={x(i)}
              y={HEIGHT - 8}
              textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'}
            >
              {formatX(rows[i].date)}
            </text>
          ))}

          {series.map((s) => (
            <path
              key={s.key}
              d={path(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {endLabels.map((s) => (
            <g key={s.key}>
              <circle cx={x(last)} cy={y(rows[last][s.key])} r="4" fill={s.color} className="chart__dot" />
              <text className="chart__end-label" x={x(last) + 12} y={s.y} dy="0.32em">
                {s.label}
              </text>
            </g>
          ))}

          {hover !== null && (
            <g pointerEvents="none">
              <line
                className="chart__crosshair"
                x1={x(hover)}
                x2={x(hover)}
                y1={margin.top}
                y2={margin.top + plotH}
              />
              {series.map((s) => (
                <circle
                  key={s.key}
                  className="chart__dot"
                  cx={x(hover)}
                  cy={y(rows[hover][s.key])}
                  r="5"
                  fill={s.color}
                />
              ))}
            </g>
          )}

          <rect
            x={margin.left - 8}
            y={margin.top}
            width={plotW + 16}
            height={plotH}
            fill="transparent"
            onPointerMove={onPointerMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
      )}

      {hover !== null && (
        <div
          className="chart__tooltip"
          style={{
            top: margin.top,
            ...(tooltipLeft
              ? { right: width - x(hover) + 12 }
              : { left: x(hover) + 12 }),
          }}
          role="status"
        >
          <div className="chart__tooltip-date">{formatXFull(rows[hover].date)}</div>
          {series.map((s) => (
            <div key={s.key} className="chart__tooltip-row">
              <span className="chart__swatch" style={{ background: s.color }} />
              <span className="chart__tooltip-label">{s.label}</span>
              <span className="chart__tooltip-value">{formatValue(rows[hover][s.key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
