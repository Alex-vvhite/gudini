import { useMemo, useState } from 'react'
import LineChart from '../components/LineChart.jsx'
import {
  PERIODS,
  SERIES,
  formatDay,
  formatFullDay,
  formatRub,
  formatRubCompact,
  loadDailyTotals,
} from '../stats.js'

export default function HomePage() {
  const [days, setDays] = useState(30)
  const [showTable, setShowTable] = useState(false)
  const { demo, rows } = useMemo(() => loadDailyTotals(days), [days])

  const totals = Object.fromEntries(
    SERIES.map((s) => [s.key, rows.reduce((sum, r) => sum + r[s.key], 0)]),
  )

  return (
    <main className="page">
      <div className="page__head">
        <h1 className="page__title">Статистика</h1>
        <div className="segmented" role="group" aria-label="Период">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              className={`segmented__item${p.days === days ? ' segmented__item--active' : ''}`}
              aria-pressed={p.days === days}
              onClick={() => setDays(p.days)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <section className="card">
        <div className="card__head">
          <div>
            <h2 className="card__title">Принято и выплачено</h2>
            <p className="card__subtitle">Сумма по дням за {PERIODS.find((p) => p.days === days).label}</p>
          </div>
          {demo && (
            <span className="badge" title="Реальных операций пока нет, график показывает пример">
              Демо-данные
            </span>
          )}
        </div>

        <div className="totals">
          {SERIES.map((s) => (
            <div key={s.key} className="total">
              <div className="total__label">
                <span className="chart__swatch" style={{ background: s.color }} />
                {s.label} <span className="total__hint">{s.hint}</span>
              </div>
              <div className="total__value">{formatRub(totals[s.key])}</div>
            </div>
          ))}
        </div>

        <LineChart
          rows={rows}
          series={SERIES}
          formatValue={formatRub}
          formatAxis={formatRubCompact}
          formatX={formatDay}
          formatXFull={formatFullDay}
        />

        <button className="link-btn card__toggle" onClick={() => setShowTable((v) => !v)}>
          {showTable ? 'Скрыть таблицу' : 'Показать таблицей'}
        </button>

        {showTable && (
          <div className="table-wrap card__table">
            <table className="table">
              <thead>
                <tr>
                  <th>Дата</th>
                  {SERIES.map((s) => (
                    <th key={s.key} className="table__right">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...rows].reverse().map((r) => (
                  <tr key={r.date}>
                    <td>{formatFullDay(r.date)}</td>
                    {SERIES.map((s) => (
                      <td key={s.key} className="table__right table__mono">
                        {formatRub(r[s.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
