import React from 'react';
import styles from "../styles/BudgetPlanner.module.css";

const categories = [
  { name: 'Transport', percentage: '15', amount: '900' },
  { name: 'Food', percentage: '30', amount: '1 800' },
  { name: 'Rent', percentage: '37', amount: '2 200' },
  { name: 'Data and airtime', percentage: '7', amount: '400' },
  { name: 'Groceries', percentage: '8', amount: '500' },
  { name: 'Other', percentage: '3', amount: '200' },
];

const BudgetPlanner: React.FC = () => {

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Budget planner</h1>
        <div className={styles.toggleGroup}>
          <button className={`${styles.toggleBtn} ${styles.activeToggle}`}>Monthly</button>
          <button className={styles.toggleBtn}>Weekly</button>
        </div>
      </header>

      {/* Top Summary Cards */}
      <div className={styles.summaryGrid}>
        
        {/* Monthly Income Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Monthly income</span>
          <div className={styles.cardValueLarge}>R 6 700.00</div>
        </div>

        {/* Total Budget Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total budget</span>
          <div className={styles.inputGroupLarge}>
            <span className={styles.currencyPrefix}>R</span>
            <input 
              type="text" 
              className={styles.amountInput} 
              defaultValue="6 000" 
            />
          </div>
        </div>

        {/* Weekly Limit Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Weekly limit, calculated</span>
          <div className={`${styles.cardValueLarge} ${styles.textBlue}`}>R 1 500.00</div>
        </div>

      </div>

      {/* Main Panel: Category Allocations */}
      <div className={styles.mainPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Category allocations</h2>
          <span className={styles.textGreen}>R 0 left to allocate</span>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((cat, index) => (
            <div key={index} className={styles.categoryItem}>
              
              <div className={styles.categoryLeft}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <span className={styles.categoryPercent}>{cat.percentage}% of budget</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.categoryRight}>
                <div className={styles.inputGroupSmall}>
                  <span className={styles.currencyPrefix}>R</span>
                  <input 
                    type="text" 
                    className={styles.amountInput} 
                    defaultValue={cat.amount} 
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.primaryBtn}>Save budget</button>
          <button className={styles.secondaryBtn}>Reset to last saved</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;