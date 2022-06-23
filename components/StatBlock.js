export default function StatBlock({value, title}) {
    return (
        <div className="stat">
        <div className="stat-title">{title}</div>
        <div className={`stat-value`}>{value.toFixed(2)}</div>
      </div>
    )
}