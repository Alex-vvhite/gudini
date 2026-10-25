import { useState } from 'react'
import Header from './components/Header.jsx'

// Разделы верхнего меню. Новый раздел — просто новая строка здесь.
const SECTIONS = [
  { id: 'devices', label: 'Устройства' },
  { id: 'payouts', label: 'Выплаты' },
]

export default function App() {
  const [active, setActive] = useState(null)

  return (
    <div className="app">
      <Header sections={SECTIONS} active={active} onSelect={setActive} />
      <main className="hero">
        <h1 className="hero__logo">gudini</h1>
      </main>
    </div>
  )
}
