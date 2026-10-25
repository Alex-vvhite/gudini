import { useEffect, useRef, useState } from 'react'
import {
  BANKS,
  CARD_MAX_DIGITS,
  CARD_MIN_DIGITS,
  METHODS,
  formatCard,
  formatPhone,
  normalizePhone,
  onlyDigits,
} from '../users.js'

const EMPTY = { name: '', bank: '', method: '', phone: '', card: '' }

function validate(form) {
  const errors = {}
  if (form.name.trim().split(/\s+/).filter(Boolean).length < 2) {
    errors.name = 'Введите фамилию и имя (отчество — по желанию)'
  }
  if (!form.bank) errors.bank = 'Выберите банк'
  if (!form.method) errors.method = 'Выберите способ'
  if (form.method === 'sbp' && form.phone.length !== 11) {
    errors.phone = 'Введите номер полностью: +7 и 10 цифр'
  }
  if (form.method === 'card' && form.card.length < CARD_MIN_DIGITS) {
    errors.card = `Номер карты — от ${CARD_MIN_DIGITS} до ${CARD_MAX_DIGITS} цифр`
  }
  return errors
}

export default function AddUserModal({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const nameRef = useRef(null)

  const errors = validate(form)
  const showError = (field) => submitted && errors[field]

  useEffect(() => {
    nameRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    onAdd({
      id: crypto.randomUUID(),
      name: form.name.trim().replace(/\s+/g, ' '),
      bank: form.bank,
      method: form.method,
      account: form.method === 'sbp' ? form.phone : form.card,
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="modal__head">
          <h2 id="add-user-title">Новый юзер</h2>
          <button type="button" className="icon-btn" aria-label="Закрыть" onClick={onClose}>
            ×
          </button>
        </div>

        <label className="field">
          <span className="field__label">ФИО</span>
          <input
            ref={nameRef}
            className="field__input"
            value={form.name}
            onChange={set('name')}
            placeholder="Иванов Иван Иванович"
            autoComplete="off"
            aria-invalid={!!showError('name')}
          />
          {showError('name') && <span className="field__error">{errors.name}</span>}
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Банк</span>
            <select
              className="field__input"
              value={form.bank}
              onChange={set('bank')}
              aria-invalid={!!showError('bank')}
            >
              <option value="" disabled>
                Выберите
              </option>
              {BANKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
            {showError('bank') && <span className="field__error">{errors.bank}</span>}
          </label>

          <label className="field">
            <span className="field__label">Способ</span>
            <select
              className="field__input"
              value={form.method}
              onChange={set('method')}
              aria-invalid={!!showError('method')}
            >
              <option value="" disabled>
                Выберите
              </option>
              {METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            {showError('method') && <span className="field__error">{errors.method}</span>}
          </label>
        </div>

        {form.method === 'sbp' && (
          <label className="field">
            <span className="field__label">Номер телефона</span>
            <input
              className="field__input"
              type="tel"
              inputMode="tel"
              value={formatPhone(form.phone)}
              onChange={(e) => setForm((f) => ({ ...f, phone: normalizePhone(e.target.value) }))}
              placeholder="+7 (900) 123-45-67"
              aria-invalid={!!showError('phone')}
            />
            {showError('phone') && <span className="field__error">{errors.phone}</span>}
          </label>
        )}

        {form.method === 'card' && (
          <label className="field">
            <span className="field__label">Номер карты</span>
            <input
              className="field__input"
              inputMode="numeric"
              value={formatCard(form.card)}
              onChange={(e) =>
                setForm((f) => ({ ...f, card: onlyDigits(e.target.value).slice(0, CARD_MAX_DIGITS) }))
              }
              placeholder="0000 0000 0000 0000 00"
              autoComplete="off"
              aria-invalid={!!showError('card')}
            />
            <span className="field__hint">
              {form.card.length} / {CARD_MAX_DIGITS} цифр
            </span>
            {showError('card') && <span className="field__error">{errors.card}</span>}
          </label>
        )}

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn--primary">
            Добавить
          </button>
        </div>
      </form>
    </div>
  )
}
