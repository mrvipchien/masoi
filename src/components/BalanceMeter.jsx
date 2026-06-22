const MAX = 20 // giới hạn hiển thị của thanh cân bằng

export default function BalanceMeter({ total }) {
  const clamped = Math.max(-MAX, Math.min(MAX, total))
  const percent = ((clamped + MAX) / (2 * MAX)) * 100

  let verdict
  if (total > 3) {
    verdict = { cls: 'village', text: 'Lợi cho Dân làng' }
  } else if (total < -3) {
    verdict = { cls: 'werewolf', text: 'Lợi cho Sói / Ma cà rồng' }
  } else {
    verdict = { cls: 'balanced', text: 'Cân bằng tốt' }
  }

  return (
    <div className="balance">
      <div className="balance-head">
        <span className="muted">Điểm cân bằng</span>
        <span className={`balance-total ${verdict.cls}`}>
          {total > 0 ? `+${total}` : total}
        </span>
      </div>

      <div className="balance-track">
        <div className="balance-center" />
        <div
          className="balance-marker"
          style={{ left: `${percent}%` }}
          title={`Tổng: ${total}`}
        />
      </div>

      <div className="balance-legend">
        <span>Sói</span>
        <span className={`verdict ${verdict.cls}`}>{verdict.text}</span>
        <span>Dân làng</span>
      </div>

      <p className="balance-hint">
        Mục tiêu: tổng gần 0. Nhóm mới/lạ người nên để +1 đến +3; nhóm đã quen
        chơi nên để -1 đến -3 cho Sói có lợi thế.
      </p>
    </div>
  )
}
