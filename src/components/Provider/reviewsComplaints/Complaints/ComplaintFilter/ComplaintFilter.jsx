import React, { useState } from 'react';
import './ComplaintFilter.css';

const ComplaintFilter = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'الكل', count: null },
    { id: 'pending', label: 'قيد الانتظار', count: 42 },
    { id: 'review', label: 'قيد المراجعة', count: 15 },
    { id: 'solved', label: 'تم الحل', count: 67 },
  ]; return (
    <div className="complaint-filter-container">
      <div className="filter-tabs">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={filter-tab ${activeFilter === filter.id ? 'active' : ''}}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label} {filter.count !== null && (${filter.count})}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComplaintFilter;
