import { useState } from 'react'

export default function Registration({ contestants, onAdd, onRemove, onStart }) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')
  const [error, setError] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Et Navn er fornødent, tappre Sjæl.')
      return
    }
    if (contestants.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Denne Kriger hath allerede indtaget Arenaen.')
      return
    }
    onAdd(trimmed, gender)
    setName('')
    setError('')
  }

  return (
    <div className="registration-screen">
      <div className="scroll-panel">
        <h2 className="panel-title">⚜ Innskriv Eders Krigere ⚜</h2>
        <p className="panel-desc">
          Hver Kriger maa fortære een Litre Faxe (10% Styrke) inden Timens Udløb.
          De som lykkes, hædres med Titelen <em>Faxeridder</em>. Den første Herre
          erholder Titelen <strong>Faxekonge</strong>, og den første Dame —{' '}
          <strong>Faxedronning</strong>. De som ei formaar det… blive{' '}
          <em>Hestemann</em>.
        </p>

        <form className="enlist-form" onSubmit={handleAdd}>
          <div className="form-row">
            <input
              className="medieval-input"
              type="text"
              placeholder="Krigerens Navn..."
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              maxLength={30}
            />
            <div className="gender-toggle">
              <button
                type="button"
                className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                ♂ Herre
              </button>
              <button
                type="button"
                className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                ♀ Dame
              </button>
            </div>
            <button type="submit" className="medieval-btn enlist-btn">
              + Innskriv
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>

        {contestants.length > 0 && (
          <div className="contestant-list">
            <h3 className="list-title">Innskrevne Krigere ({contestants.length})</h3>
            <ul>
              {contestants.map(c => (
                <li key={c.id} className="contestant-item">
                  <span className="contestant-gender-icon">
                    {c.gender === 'male' ? '♂' : '♀'}
                  </span>
                  <span className="contestant-name">{c.name}</span>
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(c.id)}
                    title="Fjern Kriger"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="start-section">
          <button
            className={`medieval-btn start-btn ${contestants.length === 0 ? 'disabled' : ''}`}
            onClick={onStart}
            disabled={contestants.length === 0}
          >
            ⚔ Begyn Kampen ⚔
          </button>
          {contestants.length === 0 && (
            <p className="start-hint">Innskriv mindst én Kriger for at begynde.</p>
          )}
        </div>
      </div>
    </div>
  )
}
