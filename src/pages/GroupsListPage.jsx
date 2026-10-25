import { useCallback, useState } from 'react'
import CreateGroupModal from '../components/CreateGroupModal.jsx'

function usersCount(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} юзер`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} юзера`
  return `${n} юзеров`
}

export default function GroupsListPage({ groups, onOpen, onCreate, onRemove }) {
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = useCallback(() => setModalOpen(false), [])

  const remove = (group) => {
    const warning = group.users.length
      ? `Удалить группу «${group.name}»? В ней ${usersCount(group.users.length)}, они тоже будут удалены.`
      : `Удалить группу «${group.name}»?`
    if (window.confirm(warning)) onRemove(group.id)
  }

  return (
    <main className="page">
      <div className="page__head">
        <h1 className="page__title">Группы</h1>
        <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
          + Создать группу
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="empty">
          <p>Пока нет ни одной группы.</p>
          <p className="empty__hint">
            Нажмите «Создать группу» в правом верхнем углу, затем добавляйте юзеров внутри группы.
          </p>
        </div>
      ) : (
        <ul className="groups">
          {groups.map((g) => (
            <li key={g.id} className="group-card">
              <button className="group-card__main" onClick={() => onOpen(g.id)}>
                <span className="group-card__name">{g.name}</span>
                <span className="group-card__meta">{usersCount(g.users.length)}</span>
              </button>
              <button
                className="icon-btn group-card__remove"
                aria-label={`Удалить группу ${g.name}`}
                title="Удалить группу"
                onClick={() => remove(g)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <CreateGroupModal
          existingNames={groups.map((g) => g.name)}
          onCreate={(group) => {
            onCreate(group)
            setModalOpen(false)
          }}
          onClose={closeModal}
        />
      )}
    </main>
  )
}
