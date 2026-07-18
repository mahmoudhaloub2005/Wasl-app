const sortOptions = [
  { id: "newest", label: "الأحدث" },
  { id: "highest", label: "الأعلى تقييما" },
  { id: "lowest", label: "الأقل تقييما" },
];

function RatingsSort({ activeSort, onChange }) {
  return (
    <section className="ratings-sort" aria-label="ترتيب التقييمات">
      <span>ترتيب حسب:</span>
      <div className="ratings-sort__buttons">
        {sortOptions.map((option) => (
          <button
            type="button"
            className={activeSort === option.id ? "is-active" : ""}
            key={option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default RatingsSort;
