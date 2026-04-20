interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  badge?: number | string;
}

function NavItem({ icon, label, active, badge }: NavItemProps) {
  return (
    <button className={`nav-item${active ? ' active' : ''}`}>
      <span className="nav-item-icon">{icon}</span>
      <span>{label}</span>
      {badge !== undefined && <span className="nav-badge">{badge}</span>}
    </button>
  );
}

export function NavSidebar() {
  return (
    <nav className="nav-sidebar">
      <div className="nav-logo">
        <div className="nav-logo-icon">C</div>
        <span className="nav-logo-text">CodeAuto</span>
        <button className="nav-collapse-btn" title="Collapse">◁</button>
      </div>

      <div className="nav-body">
        <div>
          <div className="nav-section-label">General<span className="nav-section-arrow">∧</span></div>
          <div className="nav-group">
            <NavItem icon="⊞" label="Dashboard" active />
            <NavItem icon="✓" label="Compliance" />
            <NavItem icon="◷" label="Scheduler" badge={11} />
            <NavItem icon="↗" label="Analytics" />
          </div>
        </div>
        <div>
          <div className="nav-section-label">Automation<span className="nav-section-arrow">∧</span></div>
          <div className="nav-group">
            <NavItem icon="⇄" label="Integrations" />
            <NavItem icon="◻" label="Repository" badge={7} />
            <NavItem icon="⬡" label="Workflows" />
          </div>
        </div>
        <div>
          <div className="nav-section-label">Resources<span className="nav-section-arrow">∧</span></div>
          <div className="nav-group">
            <NavItem icon="👤" label="Member" />
            <NavItem icon="☑" label="Inbox" badge={13} />
            <NavItem icon="✉" label="Messages" />
          </div>
        </div>
      </div>

      <div className="nav-footer">
        <NavItem icon="⚙" label="Settings" />
        <NavItem icon="?" label="Help & Support" />
      </div>
    </nav>
  );
}