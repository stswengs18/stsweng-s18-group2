export default function SideItem({ href, iconClass, label, isActive = false }) {
  return (
    <a href={href} className={`side-item ${isActive ? 'active' : ''}`}>
      <div className={`side-icon-setup ${iconClass} ${isActive ? 'active' : ''}`}></div>
      <p>{label}</p>
    </a>
  );
}

