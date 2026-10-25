import { useEffect, useRef, useState } from 'react'

export default function CreateGroupModal({ existingNames, onCreate, onClose }) {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef(null)

  const trimmed = name.trim().replace(/\s+/g, ' ')
  const error = !trimmed
    ? 'Введите название группы'
    : existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())
      ? 'Группа с таким названием уже есть'
      : null

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (error) return
    onCreate({ id: crypto.randomUUID(), name: trimmed, users: [] })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-group-title"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="modal__head">
          <h2 id="create-group-title">Новая группа</h2>
          <button type="button" className="icon-btn" aria-label="Закрыть" onClick={onClose}>
            ×
          </button>
        </div>

        <label className="field">
          <span className="field__label">Название</span>
          <input
            ref={inputRef}
            className="field__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Москва"
            maxLength={60}
            autoComplete="off"
            aria-invalid={submitted && !!error}
          />
          {submitted && error && <span className="field__error">{error}</span>}
        </label>

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn--primary">
            Создать
          </button>
        </div>
      </form>
    </div>
  )
}
