const tabs = [
  { id: "ratings", label: "التقييمات" },
  { id: "complaints", label: "الشكاوي" },
];

function RatingsTabs({ activeTab, onChange }) {
  return (
    <div className="provider-ratings-tabs" role="tablist" aria-label="إدارة التقييمات والشكاوي">
      {tabs.map((tab) => (
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={activeTab === tab.id ? "is-active" : ""}
          key={tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default RatingsTabs;
