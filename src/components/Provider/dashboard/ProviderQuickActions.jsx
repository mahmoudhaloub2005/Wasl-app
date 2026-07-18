import ProviderQuickActionItem from "./ProviderQuickActionItem";

function ProviderQuickActions({ actions, onNavigate }) {
  return (
    <article className="provider-dashboard-panel provider-quick-actions">
      <h2>إجراءات سريعة</h2>

      <div className="provider-quick-actions__list">
        {actions.map((action) => (
          <ProviderQuickActionItem
            action={action}
            key={action.id}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </article>
  );
}

export default ProviderQuickActions;
