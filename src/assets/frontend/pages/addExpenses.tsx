import React, { useState, useEffect } from 'react';
import styles from "../styles/AddExpenses.module.css";
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { doc, getDocs, serverTimestamp, updateDoc, increment, addDoc, collection, query, where, orderBy, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';
import { safeNum, safePercent, formatRand, migrateBudgetPlannerGroceries, migrateExpenseCategory } from '../utils/safeguards';

type Expenses = {
  id: string,
  date: Date,
  description: string,
  category: string,
  amount: number
}

type BudgetData = {
  allocated: number;
  spent: number;
};

const AddExpensePage: React.FC = () => {

  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    description: "",
    category: "",
    notes: "",
  });
  const [userExpenses, setUserExpenses] = useState<Expenses[]>([]);
  const [activeSelection, setActiveSelection] = useState<string>("");
  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Budget widget state
  const [budgetData, setBudgetData] = useState<BudgetData>({ allocated: 0, spent: 0 });
  const [budgetLoading, setBudgetLoading] = useState<boolean>(false);

  const saveData = async () => {

    try {

      setLoading(true);

      const uid = getAuth().currentUser?.uid || "";
      const expensesRef = collection(db, "expenses");
      const budgetRef = doc(db, "budget_planner", uid);

      const budgetSnapshot = await getDoc(budgetRef);
      
      if (!budgetSnapshot.exists()) {

        setError("Create a budget planner first");
        return;

      } 

      await migrateBudgetPlannerGroceries(budgetRef, budgetSnapshot.data() as Record<string, any>);

      const amountNum = safeNum(formData.amount, 0);
      const normalizedCategory =
        formData.category.toLowerCase() === "groceries"
          ? "entertainment"
          : formData.category;

      await addDoc(expensesRef, {
        userId: uid,
        date: formData.date,
        amount: amountNum,
        description: formData.description,
        category: normalizedCategory,
        notes: formData.notes,
        createdAt: serverTimestamp()
      });

      // Ensure category key exactly matches budget_planner schema (e.g. dataAndAirtime)
      const catKey =
        normalizedCategory === "dataandairtime" || normalizedCategory === "dataAndAirtime"
          ? "dataAndAirtime"
          : normalizedCategory.toLowerCase();

      await updateDoc(budgetRef, {
        [`spentTotals.${catKey}`]: increment(amountNum)
      });

      if (amountNum > 250) {

        const alertsRef = collection(db, "alerts");

        await addDoc(alertsRef, {
          userId: uid,
          createdAt: serverTimestamp(),
          status: 'info',
          title: 'Large expense recorded',
          description: `An expense of R${amountNum} was added to ${normalizedCategory}, above your R 250 large expense threshold.`
        });

      }

      console.log("Data saved to database");
      setLoading(false);
      alert("Data saved to database");

      // Refresh budget widget after saving an expense
      if (normalizedCategory) {
        fetchCategoryBudget(normalizedCategory);
      }

    } catch (e) {

      console.log("Error occured: " + e);

    } finally {

      setLoading(false);
      setFormData({
        date: "",
        amount: 0,
        description: "",
        category: "",
        notes: "",
      })

    }

  };

  const getUserData = async () => {
  
    try {

      const uid = getAuth().currentUser?.uid || "";
      const ref = collection(db, "expenses");
      const expensesQuery = query(ref,
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(expensesQuery);


      const data = snapshot?.docs.map((docSnap) =>
        migrateExpenseCategory(
          db,
          {
            id: docSnap.id,
            ...docSnap.data(),
          } as Expenses,
          docSnap.id
        )
      );

      setUserExpenses(data || []);

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }

  /**
   * Fetches the budget allocation and amount already spent for a given category
   * from the `budget_planner/{uid}` document.
   */
  const fetchCategoryBudget = async (category: string) => {

    if (!category) {
      setBudgetData({ allocated: 0, spent: 0 });
      return;
    }

    try {

      setBudgetLoading(true);

      const uid = getAuth().currentUser?.uid || "";
      const budgetRef = doc(db, "budget_planner", uid);
      const snapshot = await getDoc(budgetRef);

      if (!snapshot.exists()) {
        setBudgetData({ allocated: 0, spent: 0 });
        return;
      }

      const rawData = snapshot.data() as Record<string, any>;
      const data = (await migrateBudgetPlannerGroceries(budgetRef, rawData)) || {};

      const catKey =
        category === "dataandairtime" || category === "dataAndAirtime"
          ? "dataAndAirtime"
          : category.toLowerCase() === "groceries"
          ? "entertainment"
          : category.toLowerCase();

      // The allocated amount lives at the top-level key (e.g. data.entertainment)
      const allocated: number = safeNum(data[catKey]);

      // The amount spent so far lives under spentTotals (e.g. data.spentTotals.entertainment)
      const spent: number = safeNum(data?.spentTotals?.[catKey]);

      setBudgetData({ allocated, spent });

    } catch (e) {

      console.log("Error fetching category budget: " + e);

    } finally {

      setBudgetLoading(false);

    }

  };


  useEffect(() => {

    try {

      getUserData();

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }, []);

  // Re-fetch budget data whenever the selected category changes
  useEffect(() => {

    fetchCategoryBudget(activeSelection);

  }, [activeSelection]);

  // Derived budget values with safeguards
  const safeAllocated = safeNum(budgetData.allocated);
  const safeSpent = safeNum(budgetData.spent);
  const safeInputAmount = safeNum(formData.amount);
  const remainingBudget = Math.max(safeAllocated - safeSpent, 0);
  const projectedSpent  = safeSpent + safeInputAmount;
  const spentPercent    = safePercent(projectedSpent, safeAllocated);
  const currentPercent  = safePercent(safeSpent, safeAllocated);

  // Human-readable category label for the widget title
  const categoryLabel: Record<string, string> = {
    transport: "Transport",
    food: "Food",
    rent: "Rent",
    dataAndAirtime: "Data & Airtime",
    entertainment: "Entertainment",
    other: "Other",
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });


  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Add new expense</h1>

      {error && (
          <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
          </div>
      )}

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
                    amount: safeNum(e.target.valueAsNumber, 0),
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
                onClick={() => {
                  
                  setActiveSelection("transport");
                  setFormData((prev) => ({
                    ...prev,
                    category: "transport"
                  }))}
                }

              >
                Transport
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "food" && styles.activeChip}`}
                onClick={() => {
                  
                  setActiveSelection("food");
                  setFormData((prev) => ({
                    ...prev,
                    category: "food"
                  }))}
                }

              >
                Food
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "rent" && styles.activeChip}`}
                onClick={() => {
                  
                  setActiveSelection("rent");
                  setFormData((prev) => ({
                    ...prev,
                    category: "rent"
                  }))}
                }

              >
                Rent
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "dataAndAirtime" && styles.activeChip}`}
                onClick={() => {
                  
                  setActiveSelection("dataAndAirtime");
                  setFormData((prev) => ({
                    ...prev,
                    category: "dataAndAirtime"
                  }))}
                }

              >
                Data and airtime
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "entertainment" && styles.activeChip}`}
                onClick={() => {
                  
                  setActiveSelection("entertainment");
                  setFormData((prev) => ({
                    ...prev,
                    category: "entertainment"
                  }))}
                }

              >
                Entertainment
              </button>
              
              <button 
                className={`${styles.categoryChip} ${activeSelection === "other" && styles.activeChip}`}
                onClick={() => {
                  
                  setActiveSelection("other");
                  setFormData((prev) => ({
                    ...prev,
                    category: "other"
                  }))}
                }

              >
                Other
              </button>
            

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
              <button 
                type="button" 
                className={styles.saveBtn} 
                onClick={() => 
                  saveData()
                }
              >
                {loading !== true ? (
                  <>
                    Save expense
                  </>
                )
                :
                (
                  <LoaderCircle size={16} className={styles.loaderCircle} />
                )
                }
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Information Widgets */}
        <div className={styles.sidebar}>
          
          {/* Budget Widget */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetTitle}>
              {activeSelection ? `${categoryLabel[activeSelection] ?? activeSelection} budget` : "Category budget"}
            </h3>
            
            {budgetLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <LoaderCircle size={20} className={styles.loaderCircle} />
              </div>
            ) : activeSelection && safeAllocated > 0 ? (
              <>
                <div className={styles.budgetHeader}>
                  <span className={styles.budgetValue}>{formatRand(remainingBudget)}</span>
                  <span className={styles.budgetLimit}>left of {formatRand(safeAllocated)}</span>
                </div>
                
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${spentPercent.toFixed(1)}%` }}
                  ></div>
                </div>
                
                <p className={styles.widgetSubtext}>
                  {safeInputAmount > 0
                    ? `Saving this expense takes you to ${spentPercent.toFixed(0)}% of the ${categoryLabel[activeSelection] ?? activeSelection} category for ${currentMonth}.`
                    : `You have used ${currentPercent.toFixed(0)}% of your ${categoryLabel[activeSelection] ?? activeSelection} budget for ${currentMonth}.`
                  }
                </p>
              </>
            ) : activeSelection && safeAllocated === 0 ? (
              <p className={styles.widgetSubtext}>
                No budget allocated for {categoryLabel[activeSelection] ?? activeSelection}. Set one in the Budget Planner.
              </p>
            ) : (
              <p className={styles.widgetSubtext}>
                Select a category above to see your budget status.
              </p>
            )}
          </div>

          {/* Recent Entries Widget */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetTitle}>Similar recent entries</h3>
            
            <ul className={styles.recentList}>
              
              {userExpenses.length !== 0 ? (
                userExpenses.map((expense, index) => (
                  <li key={index} className={styles.recentItem}>
                    <span className={styles.recentDesc}>{expense.description || "Expense"}</span>
                    <span className={styles.recentAmount}>{formatRand(expense.amount)}</span>
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
