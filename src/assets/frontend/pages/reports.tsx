import React from 'react';
import styles from "../styles/Reports.module.css";

const chartData = [
  { week: 'Week 1', amount: 'R 1 180', height: '78%', type: 'normal' },
  { week: 'Week 2', amount: 'R 1 420', height: '94%', type: 'normal' },
  { week: 'Week 3', amount: 'R 1 500', height: '100%', type: 'warning' },
  { week: 'Week 4', amount: 'R 900', height: '60%', type: 'normal' },
];

const categoryData = [
  { name: 'Rent', percentage: '34' },
  { name: 'Food', percentage: '26' },
  { name: 'Transport', percentage: '17' },
  { name: 'Data', percentage: '12' },
  { name: 'Other', percentage: '11' },
];

const Reports: React.FC = () => {

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Reports and summary</h1>
        
        <div className={styles.controls}>
          <div className={styles.datePicker}>
            <span className={styles.dateLabel}>From</span>
            <span className={styles.dateValue}>01 Oct<br/>2026</span>
          </div>
          <div className={styles.datePicker}>
            <span className={styles.dateLabel}>To</span>
            <span className={styles.dateValue}>31 Oct<br/>2026</span>
          </div>
          <button className={styles.exportBtn}>
            Export<br/>report
          </button>
        </div>
      </header>

      {/* Top Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Total income</span>
          <div className={styles.cardValue}>R 6 700.00</div>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Total spent</span>
          <div className={styles.cardValue}>R 1 350.00</div>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Net balance</span>
          <div className={`${styles.cardValue} ${styles.textGreen}`}>R 5 350.00</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>
        
        {/* Left Column: Bar Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Spending by week</h2>
          
          <div className={styles.chartContainer}>
            {chartData.map((bar, index) => (
              <div key={index} className={styles.barGroup}>
                <span className={styles.barAmount}>{bar.amount}</span>
                <div 
                  className={`${styles.bar} ${bar.type === 'warning' ? styles.barAmber : styles.barBlue}`}
                  style={{ height: bar.height }}
                ></div>
                <span className={styles.barLabel}>{bar.week}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.chartFooter}>
            Amber marks the week that reached the R 1 500 weekly limit
          </div>
        </div>

        {/* Right Column: Category Breakdown */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Share by category</h2>
          
          <div className={styles.categoryList}>
            {categoryData.map((cat, index) => (
              <div key={index} className={styles.categoryRow}>
                <span className={styles.categoryName}>{cat.name}</span>
                
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBarFill}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <span className={styles.categoryPercent}>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;