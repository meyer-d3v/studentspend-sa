import React from 'react';
import styles from "../styles/FinancialTips.module.css";

const tipsData = [
  {
    category: 'SAVING',
    title: 'Pay your fixed costs first',
    description: 'Rent, transport and data come off the top the day your allowance lands. What is left is what you can actually spend.',
  },
  {
    category: 'FOOD',
    title: 'Cook in batches on Sunday',
    description: 'Four portions of samp and beans costs less than two takeaway meals and saves you the weekday decision.',
  },
  {
    category: 'TRANSPORT',
    title: 'Buy a weekly taxi total, not daily',
    description: 'Work out the full week of fares in advance so a busy Friday does not eat into food money.',
  },
  {
    category: 'DATA',
    title: 'Use campus wifi for big downloads',
    description: 'Lecture recordings and readings are the biggest drain. Queue them on campus, not on your bundle.',
  },
  {
    category: 'SAVING',
    title: 'Keep a R300 buffer',
    description: 'A small untouched amount covers a printing deadline or a broken charger without breaking the budget.',
  },
  {
    category: 'BOOKS',
    title: 'Ask before you buy prescribed books',
    description: 'Second hand copies and short loan collections cover most modules for a fraction of the price.',
  }
];

const FinancialTips: React.FC = () => {

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
          />
        </div>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterBtn} ${styles.activeFilter}`}>All</button>
          <button className={styles.filterBtn}>Saving</button>
          <button className={styles.filterBtn}>Food</button>
          <button className={styles.filterBtn}>Transport</button>
        </div>
      </div>

      {/* Tips Grid */}
      <div className={styles.tipsGrid}>
        {tipsData.map((tip, index) => (
          <div key={index} className={styles.tipCard}>
            <div className={styles.cardContent}>
              <span className={styles.categoryLabel}>{tip.category}</span>
              <h2 className={styles.cardTitle}>{tip.title}</h2>
              <p className={styles.cardDescription}>{tip.description}</p>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.readMore}>Read more</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialTips;