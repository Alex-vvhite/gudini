export default function Header({ sections, active, onSelect }) {
  return (
    <header className="header">
      <a
        className="header__logo"
        href="/"
        onClick={(e) => {
          e.preventDefault()
          onSelect(null)
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
            onClick={() => onSelect(s.id)}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
