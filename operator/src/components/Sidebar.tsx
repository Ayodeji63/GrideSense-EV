import type { Role } from '../data/mockData'

const roleItems = [
  { role: 'operator' as const, label: 'Operations Control', icon: '⌂' },
  { role: 'investor' as const, label: 'Market Opportunity', icon: '↗' },
  { role: 'policy' as const, label: 'Policy Planning', icon: '▣' },
]

const navItems = ['Overview', 'Station Map', 'Alert History', 'Reports', 'Settings']

interface SidebarProps {
  activeRole: Role
  onRoleChange: (role: Role) => void
}

export function Sidebar({ activeRole, onRoleChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo-block">
          <div className="brand-row">
            <span className="bolt">⚡</span>
            <strong>GridSense EV</strong>
          </div>
          <span>Analytics Dashboard</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Workspace</div>
          <div className="role-stack">
            {roleItems.map((item) => (
              <button
                type="button"
                key={item.role}
                className={`role-button ${activeRole === item.role ? 'active' : ''}`}
                onClick={() => onRoleChange(item.role)}
              >
                <span className="role-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <nav className="sidebar-section nav-stack" aria-label="Product navigation">
          {navItems.map((item) => (
            <button type="button" className="nav-link" title="Coming soon" key={item}>
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="live-status">
          <span className="pulse-dot" />
          Connected · ME371
        </div>
        <div className="user-row">
          <div className="avatar">AO</div>
          <div>
            <strong>Amara Okonkwo</strong>
            <span>{activeRole === 'operator' ? 'GridSense member' : activeRole === 'investor' ? 'Market analyst' : 'Policy planner'}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
