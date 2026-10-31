import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/FinancialTips.module.css";
import tipsData from './tipsData';

const ALL_FILTERS = ['All', 'Saving', 'Food', 'Transport', 'Data', 'Books'];

const FinancialTips: React.FC = () => {

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  // Both filters compose and update immediately on every state change —
  // no button click or useEffect delay needed.
  const visibleTips = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return tipsData.filter((tip) => {
      // Category chip filter — 'All' bypasses, otherwise match case-insensitively
      const matchesCategory =
        activeFilter === 'All' ||
        tip.category.toLowerCase() === activeFilter.toLowerCase();

      // Live search — matches title, description, or category label
      const matchesSearch =
        !searchTerm ||
        tip.title.toLowerCase().includes(searchTerm) ||
        tip.description.toLowerCase().includes(searchTerm) ||
        tip.category.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, search]);

  const emptyMessage =
    search.trim() && activeFilter !== 'All'
      ? `No ${activeFilter.toLowerCase()} tips match "${search}".`
      : search.trim()
      ? `No tips match "${search}".`
      : `No tips in the ${activeFilter} category yet.`;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Financial tips</h1>

      {/* Search and Filters */}
      <div className={styles.controlsRow}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search tips"
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterButtons}>
          {ALL_FILTERS.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Result count hint */}
      <p style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 1rem 0' }}>
        {visibleTips.length === tipsData.length
          ? `Showing all ${tipsData.length} tips`
          : `Showing ${visibleTips.length} of ${tipsData.length} tips`}
      </p>

      {/* Tips Grid */}
      <div className={styles.tipsGrid}>
        {visibleTips.length > 0 ? (
          visibleTips.map((tip) => (
            <div key={tip.id} className={styles.tipCard}>
              <div className={styles.cardContent}>
                <span className={styles.categoryLabel}>{tip.category}</span>
                <h2 className={styles.cardTitle}>{tip.title}</h2>
                <p className={styles.cardDescription}>{tip.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <span
                  className={styles.readMore}
                  onClick={() => navigate(`/financialTips/${tip.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/financialTips/${tip.id}`)}
                >
                  Read more →
                </span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#888', gridColumn: '1 / -1', margin: 0 }}>
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default FinancialTips;
