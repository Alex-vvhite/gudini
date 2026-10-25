import { useEffect, useState } from 'react'
import { loadGroups, saveGroups } from '../users.js'
import GroupsListPage from './GroupsListPage.jsx'
import GroupPage from './GroupPage.jsx'

// Раздел «Группы»: #groups — список групп, #groups/<id> — юзеры одной группы.
export default function GroupsSection({ param }) {
  const [groups, setGroups] = useState(loadGroups)

  useEffect(() => saveGroups(groups), [groups])

  const openGroup = (id) => {
    window.location.hash = `groups/${encodeURIComponent(id)}`
  }
  const backToList = () => {
    window.location.hash = 'groups'
  }

  const updateGroup = (id, change) =>
    setGroups((list) => list.map((g) => (g.id === id ? change(g) : g)))

  const group = param && groups.find((g) => g.id === param)

  if (param && !group) {
    return (
      <main className="page">
        <div className="empty">
          <p>Такой группы нет — возможно, её удалили.</p>
          <p className="empty__hint">
            <button className="link-btn" onClick={backToList}>
              ← Ко всем группам
            </button>
          </p>
        </div>
      </main>
    )
  }

  if (group) {
    return (
      <GroupPage
        group={group}
        onBack={backToList}
        onAddUser={(user) => updateGroup(group.id, (g) => ({ ...g, users: [...g.users, user] }))}
        onRemoveUser={(userId) =>
          updateGroup(group.id, (g) => ({ ...g, users: g.users.filter((u) => u.id !== userId) }))
        }
      />
    )
  }

  return (
    <GroupsListPage
      groups={groups}
      onOpen={openGroup}
      onCreate={(newGroup) => setGroups((list) => [...list, newGroup])}
      onRemove={(id) => setGroups((list) => list.filter((g) => g.id !== id))}
    />
  )
}
