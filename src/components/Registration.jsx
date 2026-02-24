import { useState } from 'react'

export default function Registration({ contestants, onAdd, onRemove, onStart }) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')
  const [error, setError] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('A name is required, brave soul.')
      return
    }
    if (contestants.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('This warrior has already entered the arena.')
      return
    }
    onAdd(trimmed, gender)
    setName('')
    setError('')
  }

  return (
    <div className="registration-screen">
      <div className="scroll-panel">
        <h2 className="panel-title">⚜ Enlist Your Warriors ⚜</h2>
        <p className="panel-desc">
          Each warrior must consume one litre of Faxe (10% ABV) within the hour.
          Those who succeed become <em>Faxeridder</em>. The first male earns the
          title of <strong>Faxekonge</strong>, the first female —{' '}
          <strong>Faxedronning</strong>. Those who fail… become{' '}
          <em>Hestemann</em>.
        </p>

        <form className="enlist-form" onSubmit={handleAdd}>
          <div className="form-row">
            <input
              className="medieval-input"
              type="text"
              placeholder="Warrior's name..."
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
                ♂ Male
              </button>
              <button
                type="button"
                className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                ♀ Female
              </button>
            </div>
            <button type="submit" className="medieval-btn enlist-btn">
              + Enlist
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>

        {contestants.length > 0 && (
          <div className="contestant-list">
            <h3 className="list-title">Enlisted Warriors ({contestants.length})</h3>
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
                    title="Remove warrior"
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
            ⚔ Begin the Contest ⚔
          </button>
          {contestants.length === 0 && (
            <p className="start-hint">Enlist at least one warrior to begin.</p>
          )}
        </div>
      </div>
    </div>
  )
}
