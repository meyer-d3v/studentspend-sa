import React, { useEffect, useState } from 'react';
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

  const [userData, setUserData] = useState({
    monthlyIncome: 0,
    monthlyLimit: 0,
    weeklyLimit: 0,
    catagoryAllocations: {
      transport: 900,
      food: 1800, 
      rent: 2200,
      dataAndAirtime: 400,
      groceries: 500,
      other: 200,
    }
  });

  const [activeToggle, setActiveToggle] = useState<String>("monthly");

  const getUserInformation = async () => {

    try {


    } catch (e) {


    }

  }

  const saveBudget = async () => {

    try {


    } catch (e) {


    } finally {

      
    }

  };

  const resetBudget = async () => {

    try {


    } catch (e) {


    } finally {


    }

  };



  useEffect(() => {


    try {

      getUserInformation();


    } catch (e) {


    }

  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Budget planner</h1>
        <div className={styles.toggleGroup}>
          <button 
            className={`${styles.toggleBtn} ${activeToggle === "monthly" && styles.activeToggle}`}
            onClick={() => setActiveToggle("monthly")}
          >
            Monthly
          </button>
          
          <button 
            className={`${styles.toggleBtn} ${activeToggle === "weekly" && styles.activeToggle}`}
            onClick={() => setActiveToggle("weekly")}
          >
            Weekly
          </button>
        </div>
      </header>

      {/* Top Summary Cards */}
      <div className={styles.summaryGrid}>
        
        {/* Monthly Income Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Monthly income</span>
          <div className={styles.cardValueLarge}>R {userData.monthlyIncome || 0}</div>
        </div>

        {/* Total Budget Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total budget</span>
          <div className={styles.inputGroupLarge}>
            <span className={styles.currencyPrefix}>R</span>
            <input 
              type="text" 
              className={styles.amountInput} 
              value={userData.monthlyLimit} 
              onChange={(e) => setUserData((prev) => ({
                ...prev,
                monthlyLimit: e.target.valueAsNumber,
                weeklyLimit: (e.target.valueAsNumber / 4)
              }))}
              placeholder="6 000" 
            />
          </div>
        </div>

        {/* Weekly Limit Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Weekly limit, calculated</span>
          <div className={`${styles.cardValueLarge} ${styles.textBlue}`}>R {userData.weeklyLimit}</div>
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
                    placeholder={cat.amount} 
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.primaryBtn} onClick={() => saveBudget()}>Save budget</button>
          <button className={styles.secondaryBtn} onClick={() => resetBudget()}>Reset to last saved</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;