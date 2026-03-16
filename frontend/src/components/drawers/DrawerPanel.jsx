
const DRAWER_COLORS = {
    teal:   { bg: 'rgba(20,184,166,0.08)',  border: '#14B8A6', text: '#0f766e' },
    purple: { bg: 'rgba(168,85,247,0.08)',  border: '#A855F7', text: '#7c3aed' },
    amber:  { bg: 'rgba(245,158,11,0.08)',  border: '#F59E0B', text: '#b45309' },
    slate:  { bg: 'rgba(99,102,241,0.07)',  border: 'var(--violet)', text: 'var(--violet)' },
}

export default function DrawerPanel({ title, color, onClose, children }) {
    const dc = DRAWER_COLORS[color] || DRAWER_COLORS.slate

    return (
        <div className="tu-drawer" style={{ borderColor: dc.border }}>
            <div className="tu-drawer-header" style={{ background: dc.bg, borderBottomColor: dc.border }}>
                <span className="tu-drawer-title" style={{ color: dc.text }}>{title}</span>
                <button className="tu-drawer-close" onClick={onClose} title="Close">✕</button>
            </div>
            <div className="tu-drawer-body">{children}</div>
        </div>
    )
}
