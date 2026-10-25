import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import DevicesPage from './pages/DevicesPage.jsx'

// Разделы верхнего меню. Новый раздел — просто новая строка здесь.
const SECTIONS = [
  { id: 'devices', label: 'Устройства' },
  { id: 'payouts', label: 'Выплаты' },
]

// Текущий раздел берётся из адреса (#devices), чтобы он сохранялся при перезагрузке.
function readSection() {
  const id = window.location.hash.slice(1)
  return SECTIONS.some((s) => s.id === id) ? id : null
}

export default function App() {
  const [active, setActive] = useState(readSection)

  useEffect(() => {
    const onHashChange = () => setActive(readSection())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const select = (id) => {
    if (id) {
      window.location.hash = id
    } else {
      history.pushState(null, '', window.location.pathname)
      setActive(null)
    }
  }

  return (
    <div className="app">
      <Header sections={SECTIONS} active={active} onSelect={select} />
      {active === 'devices' ? (
        <DevicesPage />
      ) : (
        <main className="hero">
          <h1 className="hero__logo">gudini</h1>
        </main>
      )}
    </div>
  )
}
