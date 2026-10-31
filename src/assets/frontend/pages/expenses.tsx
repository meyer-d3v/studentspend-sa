import React, { useEffect, useState } from 'react';
import styles from "../styles/Expenses.module.css";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDocs, query, where, collection, deleteDoc, doc } from 'firebase/firestore';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { Trash2 } from 'lucide-react';

type Expense = {
  id: string;
  date: any;
  description: string;
  category: string;
  amount: number;
};

type CategorySummary = {
  name: string;
  amount: string;
  percentage: string;
};

const Expenses: React.FC = () => {

  const [userExpenses, setUserExpenses] = useState<Expense[]>([]);
  const [categoryExpensesData, setCategoryExpensesData] = useState<CategorySummary[]>([]);
  const [totalAmountForExpenses, setTotalAmountForExpense] = useState<number>(0);
  const [filtered, setFiltered] = useState<Expense[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const navigatePage = (path: string) => {
    navigate("/" + path);
  };

  const buildCategoryData = (data: Expense[]): { categories: CategorySummary[]; total: number } => {

    let total = 0;

    // All categories that the app supports, keyed by the lowercase Firestore value
    const categoryMap: Record<string, { label: string; amount: number }> = {
      food:           { label: "Food",            amount: 0 },
      transport:      { label: "Transport",        amount: 0 },
      rent:           { label: "Rent",             amount: 0 },
      dataandairtime: { label: "Data and airtime", amount: 0 },
      groceries:      { label: "Groceries",        amount: 0 },
      other:          { label: "Other",            amount: 0 },
    };

    data.forEach((expense) => {

      total += expense.amount;

      // Normalise the Firestore category value to a lookup key
      const raw = (expense.category ?? "other").toLowerCase().replace(/\s+/g, "");

      // Handle known aliases
      const key =
        raw === "data" || raw === "data&airtime" ? "dataandairtime"
        : raw === "education"                    ? "other"
        : categoryMap[raw] !== undefined         ? raw
        : "other";

      categoryMap[key].amount += expense.amount;

    });

    const categories: CategorySummary[] = Object.values(categoryMap).map((cat) => ({
      name:       cat.label,
      amount:     `R ${cat.amount.toFixed(2)}`,
      percentage: total > 0 ? `${((cat.amount / total) * 100).toFixed(1)}%` : "0%",
    }));

    return { categories, total };

  };

  const fetchUserExpenses = async () => {

    try {

      setLoading(true);

      const uid = getAuth().currentUser?.uid || "";
      const ref = collection(db, "expenses");

      const expensesQuery = query(
        ref,
        where("userId", "==", uid)
      );
      
      const snapshot = await getDocs(expensesQuery);

      if (snapshot.empty) {
        setUserExpenses([]);
        setCategoryExpensesData([]);
        setTotalAmountForExpense(0);
        return;
      }

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Expense[];

      // Sort descending by date for the table view
      data.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setUserExpenses(data);
      setFiltered(data);

      // Build category summary from the freshly-fetched data (not stale state)
      const { categories, total } = buildCategoryData(data);
      setCategoryExpensesData(categories);
      setTotalAmountForExpense(total);

    } catch (e) {

      console.log("Error occured: " + e);
      setError("Error occured: " + e);

    } finally {

      setLoading(false);

    }

  };

  const deleteExpense = async (id: string) => {

    try {

      const ref = doc(db, "expenses", id);
      await deleteDoc(ref);
      fetchUserExpenses();

    } catch (e) {

      setError("Error occured trying to delete expense. Error: " + e);

    }

  };


  useEffect(() => {

    try {
      fetchUserExpenses();
    } catch (e) {
      console.log("Error occured: " + e);
    }

  }, []);


  // Search/filter — searches description, category, and date
  useEffect(() => {

    try {

      if (!search.trim()) {
        setFiltered(userExpenses);
        return;
      }

      const s = search.toLowerCase();

      const result = userExpenses.filter((expense) => {
        const dateStr = expense.date?.toDate
          ? expense.date.toDate().toDateString()
          : new Date(expense.date).toDateString();

        return (
          (expense.description ?? "").toLowerCase().includes(s) ||
          (expense.category    ?? "").toLowerCase().includes(s) ||
          dateStr.toLowerCase().includes(s)
        );
      });

      setFiltered(result);

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }, [search, userExpenses]);


  const displayList = search.trim() ? filtered : userExpenses;


  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Expenses</h1>
        <button className={styles.primaryBtn} onClick={() => navigatePage("addExpenses")}>Add expense</button>
      </header>

      {error && (
          <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
          </div>
      )}

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search expenses" 
          className={styles.searchInput} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.selectWrapper}>
          <select className={styles.selectInput}>
            <option>All categories</option>
          </select>
        </div>
        <div className={styles.selectWrapper}>
          <select className={styles.selectInput}>
            <option>This month</option>
          </select>
        </div>
        <button className={styles.filterBtn}>Apply filters</button>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>
        
        {/* Left Column: Expenses Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className={styles.textRight}>Amount</th>
                  <th className={styles.textRight}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>Loading expenses...</td>
                  </tr>
                ) : displayList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                      {search.trim() ? "No expenses match your search." : "No expenses recorded yet."}
                    </td>
                  </tr>
                ) : (
                  displayList.map((expense, index) => (
                    <tr key={expense.id ?? index}>
                      <td className={styles.textMuted}>
                        {expense.date?.toDate
                          ? expense.date.toDate().toLocaleDateString()
                          : new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className={styles.textMuted} style={{ textTransform: 'capitalize' }}>
                        {expense.category}
                      </td>
                      <td className={styles.textDark}>{expense.description}</td>
                      <td className={`${styles.textRight} ${styles.textBold}`}>
                        R {Number(expense.amount).toFixed(2)}
                      </td>
                      <td className={styles.textRight}>
                        <button 
                          className={styles.editLink}
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className={styles.pagination}>
            <span className={styles.textMuted}>
              Showing {displayList.length} of {userExpenses.length} expense{userExpenses.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Right Column: Category Summary */}
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Expenses by category</h3>

          <div className={styles.categoryList}>
            {loading ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>
            ) : categoryExpensesData.length === 0 ? (
              <div className={styles.categoryItem}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>No expenses found</span>
                  <span className={styles.categoryAmount}></span>
                </div>
              </div>
            ) : (
              categoryExpensesData.map((cat, index) => (
                <div key={index} className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={styles.categoryAmount}>{cat.amount}</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBarFill} 
                      style={{ width: cat.percentage }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{cat.percentage}</span>
                </div>
              ))
            )}
          </div>

          <div className={styles.summaryFooter}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>R {totalAmountForExpenses.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Expenses;
