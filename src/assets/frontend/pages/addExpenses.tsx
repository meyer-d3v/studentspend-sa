import React, { useState, useEffect } from 'react';
import styles from "../styles/AddExpenses.module.css";
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { doc, getDoc, serverTimestamp, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

type Expenses = {
  date: Date,
  item: string,
  category: string,
  amount: number
}

const AddExpensePage: React.FC = () => {

  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    description: "",
    category: "",
    notes: "",
  });
  const [userExpenses, setUserExpenses] = useState<Array<Expenses>>([]);
  const [activeSelection, setActiveSelection] = useState<string>("");

  const categories = [
    "Transport",
    "Food",
    "Rent",
    "Data & Airtime",
    "Groceries",
    "Other",
  ];

  const saveData = async () => {

    try {

      const uid = getAuth().currentUser?.uid || "";
      const expensesRef = collection(db, "expenses");
      const budgetRef = doc(db, "budget_planner", uid)

      await addDoc(expensesRef, {
        userId: uid,
        date: formData.date,
        amount: formData.amount,
        description: formData.description,
        category: formData.category,
        notes: formData.notes,
        createdAt: serverTimestamp()
      });

      await updateDoc(budgetRef, {
        [`spentTotals.${(formData.category).toLowerCase()}`]: increment(formData.amount)
      });

      console.log("Data saved to database");

    } catch (e) {

      console.log("Error occured: " + e);

    }

  };

  const getUserData = async () => {
  
    try {

      const uid = getAuth().currentUser?.uid || "";
      const ref = doc(db, "expenses", uid);
      const snapshot = await getDoc(ref);


      const data = snapshot?.data() as unknown as Array<Expenses>;

      setUserExpenses(data || []);

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }


  useEffect(() => {

    try {

      getUserData();

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }, []);


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
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "transport" && styles.activeChip}`}
                onClick={() => setActiveSelection("transport")}
              >
                Transport
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "food" && styles.activeChip}`}
                onClick={() => setActiveSelection("food")}
              >
                Food
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "rent" && styles.activeChip}`}
                onClick={() => setActiveSelection("rent")}
              >
                Rent
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "dataAndAirtime" && styles.activeChip}`}
                onClick={() => setActiveSelection("dataAndAirtime")}
              >
                Data and airtime
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "groceries" && styles.activeChip}`}
                onClick={() => setActiveSelection("groceries")}
              >
                Groceries
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "entertainment" && styles.activeChip}`}
                onClick={() => setActiveSelection("entertainment")}
              >
                Entertainment
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "tuition" && styles.activeChip}`}
                onClick={() => setActiveSelection("tuition")}
              >
                Tuition
              </button>

              {categories.map((c) => (
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
              <button type="button" className={styles.saveBtn} onClick={() => saveData()}>Save expense</button>
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
              
              {userExpenses.length !== 0 ? (
                userExpenses.map((expense, index) => (
                  <li key={index} className={styles.recentItem}>
                    <span className={styles.recentDesc}>{expense.item}</span>
                    <span className={styles.recentAmount}>R {expense.amount}</span>
                  </li>
                ))
              )
              :
              (
                <li className={styles.recentItem}>
                  <span className={styles.recentDesc}>No recent expenses</span>
                  <span className={styles.recentAmount}></span>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddExpensePage;