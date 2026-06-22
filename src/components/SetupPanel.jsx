import { useState } from 'react'
import {
  ROLE_BY_ID,
  TEAMS,
  canIncreaseRole,
  getRoleImageSrc,
} from '../data/roles.js'
import BalanceMeter from './BalanceMeter.jsx'

function balanceClass(total) {
  if (total > 3) return 'village'
  if (total < -3) return 'werewolf'
  return 'balanced'
}

export default function SetupPanel({
  selected,
  totalPlayers,
  totalValue,
  onInc,
  onDec,
  onRemove,
  onClear,
  onStart,
}) {
  const [expanded, setExpanded] = useState(false)
  const entries = Object.entries(selected).filter(([, c]) => c > 0)
  const valueLabel = totalValue > 0 ? `+${totalValue}` : String(totalValue)

  return (
    <section
      className={`panel setup${expanded ? ' setup-expanded' : ''}`}
      data-has-roles={entries.length > 0 ? 'true' : 'false'}
    >
      <button
        type="button"
        className="setup-dock-bar"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls="setup-sheet"
      >
        <div className="setup-dock-info">
          {entries.length > 0 && (
            <div className="setup-dock-avatars" aria-hidden="true">
              {entries.slice(0, 5).map(([id, count]) => {
                const role = ROLE_BY_ID[id]
                const team = TEAMS[role.team]
                const imageSrc = getRoleImageSrc(id)
                return (
                  <span key={id} className="setup-dock-avatar-wrap">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt=""
                        className="setup-dock-avatar"
                        style={{ borderColor: team.color }}
                      />
                    ) : (
                      <span
                        className="setup-dock-avatar setup-dock-avatar-fallback"
                        style={{ background: team.color }}
                      />
                    )}
                    {count > 1 && (
                      <span className="setup-dock-avatar-count">{count}</span>
                    )}
                  </span>
                )
              })}
              {entries.length > 5 && (
                <span className="setup-dock-more">+{entries.length - 5}</span>
              )}
            </div>
          )}
          <strong>{totalPlayers}</strong>
          <span>người chơi</span>
          {entries.length > 0 && (
            <span className="setup-dock-roles">{entries.length} vai trò</span>
          )}
        </div>
        <span className={`setup-dock-balance ${balanceClass(totalValue)}`}>
          {valueLabel}
        </span>
        <span className="setup-dock-chevron" aria-hidden="true">
          {expanded ? '▾' : '▴'}
        </span>
      </button>

      <div id="setup-sheet" className="setup-sheet">
        <div className="panel-head">
          <h2>Ván đấu</h2>
          <span className="muted">{totalPlayers} người chơi</span>
        </div>

        <BalanceMeter total={totalValue} />

        {entries.length === 0 ? (
          <p className="empty">
            Chưa có vai trò nào. Hãy thêm từ thư viện vai trò.
          </p>
        ) : (
          <ul className="selected-list">
            {entries.map(([id, count]) => {
              const role = ROLE_BY_ID[id]
              const team = TEAMS[role.team]
              const canInc = canIncreaseRole(id, selected)
              const imageSrc = getRoleImageSrc(id)
              return (
                <li key={id} className="selected-item">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt=""
                      className="selected-role-img"
                      style={{ borderColor: team.color }}
                      title={team.label}
                    />
                  ) : (
                    <span
                      className="team-dot"
                      style={{ background: team.color }}
                      title={team.label}
                    />
                  )}
                  <div className="selected-main">
                    <span className="selected-name">{role.name}</span>
                    <span
                      className={`selected-value${
                        role.value > 0
                          ? ' pos'
                          : role.value < 0
                            ? ' neg'
                            : ' zero'
                      }`}
                    >
                      {role.value > 0 ? `+${role.value}` : role.value}
                    </span>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      onClick={() => onDec(id)}
                      aria-label={`Giảm ${role.name}`}
                    >
                      −
                    </button>
                    <span className="stepper-count">
                      {count}
                      {role.max > 1 && (
                        <span className="stepper-limit">/{role.max}</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => onInc(id)}
                      disabled={!canInc}
                      aria-label={`Tăng ${role.name}`}
                      title={!canInc ? `Tối đa ${role.max}` : undefined}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => onRemove(id)}
                    aria-label={`Xóa ${role.name}`}
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="setup-actions">
        <button
          type="button"
          className="start-btn"
          disabled={totalPlayers === 0}
          onClick={onStart}
        >
          Bắt đầu
          {totalPlayers > 0 && (
            <span className="start-btn-meta">{totalPlayers} người</span>
          )}
        </button>
        <button
          type="button"
          className="ghost-btn"
          disabled={entries.length === 0}
          onClick={onClear}
        >
          Làm lại
        </button>
      </div>
    </section>
  )
}
