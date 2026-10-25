import { useCallback, useEffect, useState } from 'react'
import AddUserModal from '../components/AddUserModal.jsx'
import { BANKS, METHODS, formatCard, formatPhone, labelOf, loadUsers, saveUsers } from '../users.js'

export default function DevicesPage() {
  const [users, setUsers] = useState(loadUsers)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => saveUsers(users), [users])

  const closeModal = useCallback(() => setModalOpen(false), [])

  const addUser = (user) => {
    setUsers((list) => [...list, user])
    setModalOpen(false)
  }

  const removeUser = (id) => setUsers((list) => list.filter((u) => u.id !== id))

  return (
    <main className="page">
      <div className="page__head">
        <h1 className="page__title">Устройства</h1>
        <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
          + Добавить юзера
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty">
          <p>Пока нет ни одного юзера.</p>
          <p className="empty__hint">Нажмите «Добавить юзера» в правом верхнем углу.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>ФИО</th>
                <th>Банк</th>
                <th>Способ</th>
                <th>Реквизиты</th>
                <th aria-label="Действия" />
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td className="table__num">{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{labelOf(BANKS, u.bank)}</td>
                  <td>
                    <span className={`tag tag--${u.method}`}>{labelOf(METHODS, u.method)}</span>
                  </td>
                  <td className="table__mono">
                    {u.method === 'sbp' ? formatPhone(u.account) : formatCard(u.account)}
                  </td>
                  <td className="table__actions">
                    <button
                      className="icon-btn"
                      aria-label={`Удалить ${u.name}`}
                      title="Удалить"
                      onClick={() => removeUser(u.id)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && <AddUserModal onAdd={addUser} onClose={closeModal} />}
    </main>
  )
}
