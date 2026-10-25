export default function Header({ sections, active, onHome }) {
  return (
    <header className="header">
      <a
        className="header__logo"
        href={import.meta.env.BASE_URL}
        onClick={(e) => {
          e.preventDefault()
          onHome()
        }}
      >
        gudini
      </a>
      <nav className="header__nav" aria-label="Основное меню">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`header__link${active === s.id ? ' header__link--active' : ''}`}
            aria-current={active === s.id ? 'page' : undefined}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
