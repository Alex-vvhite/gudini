import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import GroupsSection from './pages/GroupsSection.jsx'
import HomePage from './pages/HomePage.jsx'
import PayoutsPage from './pages/PayoutsPage.jsx'

const PAGES = {
  groups: GroupsSection,
  payouts: PayoutsPage,
}

// Разделы верхнего меню. Новый раздел — просто новая строка здесь.
const SECTIONS = [
  { id: 'groups', label: 'Группы' },
  { id: 'payouts', label: 'Выплаты' },
]

// Старые адреса, которые ведут на новые разделы.
const RENAMED = { devices: 'groups' }

// Адрес вида #groups/<id>: раздел и необязательный параметр внутри него.
// Берётся из адреса, чтобы открытый экран сохранялся при перезагрузке.
function readRoute() {
  const [rawSection, param = null] = window.location.hash.slice(1).split('/')
  const section = RENAMED[rawSection] ?? rawSection
  return SECTIONS.some((s) => s.id === section)
    ? { section, param: param && decodeURIComponent(param) }
    : { section: null, param: null }
}

export default function App() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goHome = () => {
    history.pushState(null, '', window.location.pathname)
    setRoute({ section: null, param: null })
  }

  const Page = PAGES[route.section]

  return (
    <div className="app">
      <Header sections={SECTIONS} active={route.section} onHome={goHome} />
      {Page ? <Page param={route.param} /> : <HomePage />}
    </div>
  )
}
