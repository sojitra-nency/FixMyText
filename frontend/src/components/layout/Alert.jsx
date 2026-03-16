
export default function Alert({ alert }) {
    if (!alert) return null

    return (
        <div className="tu-toast-wrapper">
            <div className={`tu-toast tu-toast--${alert.type}`}>
                <span className="tu-toast-dot" />
                <span>{alert.msg}</span>
            </div>
        </div>
    )
}
