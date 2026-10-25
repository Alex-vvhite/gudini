// Заявки на выплату появятся здесь, когда будет источник данных.
const requests = []

export default function PayoutsPage() {
  return (
    <main className="page">
      <div className="page__head">
        <h1 className="page__title">Выплаты</h1>
        <span className="page__counter">Заявок: {requests.length}</span>
      </div>

      {requests.length === 0 ? (
        <div className="empty">
          <p>Заявок пока нет.</p>
          <p className="empty__hint">Новые заявки на выплату будут появляться здесь списком.</p>
        </div>
      ) : (
        <ul className="requests">
          {requests.map((r) => (
            <li key={r.id} className="requests__item">
              {r.id}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
