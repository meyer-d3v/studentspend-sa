import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/FinancialTips.module.css";
import tipsData from './tipsData';

const ALL_FILTERS = ['All', 'Saving', 'Food', 'Transport', 'Data', 'Books'];

const FinancialTips: React.FC = () => {

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const visibleTips = tipsData.filter((tip) => {
    const matchesCategory =
      activeFilter === 'All' ||
      tip.category.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      !search.trim() ||
      tip.title.toLowerCase().includes(search.toLowerCase()) ||
      tip.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
          <p style={{ color: '#888', gridColumn: '1 / -1' }}>
            No tips match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default FinancialTips;
