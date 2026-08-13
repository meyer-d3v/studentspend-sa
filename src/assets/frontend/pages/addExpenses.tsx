import React, { useState } from 'react';
import styles from "../styles/AddExpenses.module.css";

const AddExpensePage: React.FC = () => {

  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    description: "",
    catagory: "",
    notes: "",
  });

  const [activeSelection, setActiveSelection] = useState<string>("");

  const catagories = [
    "Transport",
    "Food",
    "Rent",
    "Data & Airtime",
    "Groceries",
    "Entertainment",
    "Tuition"
  ]

  


  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Add new expense</h1>

      <div className={styles.layout}>
        {/* Left Column: Form Panel */}
        <div className={styles.formCard}>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Date</label>
              <input 
                type="date" 
                className={styles.input} 
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))}
                placeholder="2026-10-26" 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Amount</label>
              <div className={styles.amountWrapper}>
                <span className={styles.currencySymbol}>R</span>
                <input 
                  type="number" 
                  className={styles.amountInput} 
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    amount: e.target.valueAsNumber,
                  }))}
                  placeholder="150.00" 
                />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <input 
              type="text" 
              className={styles.input} 
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))}
              placeholder="Groceries at Shoprite" 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <div className={styles.categoryContainer}>
              <button className={styles.categoryChip}>Transport</button>
              <button className={styles.categoryChip}>Food</button>
              <button className={styles.categoryChip}>Rent</button>
              <button className={styles.categoryChip}>Data and airtime</button>
              <button className={`${styles.categoryChip} ${styles.activeChip}`}>Groceries</button>
              <button className={styles.categoryChip}>Entertainment</button>
              <button className={styles.categoryChip}>Tuition</button>

              {catagories.map((c) => (
                <button 
                  key={c}
                  value={c}
                  className={`${styles.categoryChip} ${activeSelection === c && styles.activeChip}`}
                  onClick={() => {
                    if (activeSelection == c) {
                      setActiveSelection("");
                    } else {
                      setActiveSelection(c);
                    }
                  }}
                >
                  {c}
                </button>
              ))}

            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Notes (optional)</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Weekly shop, split with roommate"
              rows={3}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                notes: e.target.value,
              }))}
            ></textarea>
          </div>

          <div className={styles.formFooter}>
            <button type="button" className={styles.uploadBtn}>
              + Upload receipt
            </button>
            
            <div className={styles.actionButtons}>
              <button type="button" className={styles.cancelBtn}>Cancel</button>
              <button type="button" className={styles.saveBtn} onClick={() => console.log(formData)}>Save expense</button>
            </div>
          </div>
        </div>

        {/* Right Column: Information Widgets */}
        <div className={styles.sidebar}>
          
          {/* Budget Widget */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetTitle}>Groceries budget</h3>
            
            <div className={styles.budgetHeader}>
              <span className={styles.budgetValue}>R 160</span>
              <span className={styles.budgetLimit}>left of R 500</span>
            </div>
            
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarFill} style={{ width: '68%' }}></div>
            </div>
            
            <p className={styles.widgetSubtext}>
              Saving this expense takes you to 68% of the category for October.
            </p>
          </div>

          {/* Recent Entries Widget */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetTitle}>Similar recent entries</h3>
            
            <ul className={styles.recentList}>
              <li className={styles.recentItem}>
                <span className={styles.recentDesc}>Groceries at Shoprite</span>
                <span className={styles.recentAmount}>R 178.00</span>
              </li>
              <li className={styles.recentItem}>
                <span className={styles.recentDesc}>Groceries at Boxer</span>
                <span className={styles.recentAmount}>R 142.50</span>
              </li>
              <li className={styles.recentItem}>
                <span className={styles.recentDesc}>Groceries at Pick n Pay</span>
                <span className={styles.recentAmount}>R 205.00</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddExpensePage;