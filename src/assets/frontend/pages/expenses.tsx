import React, { useEffect, useState } from 'react';
import styles from "../styles/Expenses.module.css";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
/*
const expensesData = [
  { date: '26 Oct', item: 'Groceries at Shoprite', category: 'Groceries', amount: 'R 190.00' },
  { date: '25 Oct', item: 'Taxi to campus', category: 'Transport', amount: 'R 34.00' },
  { date: '24 Oct', item: 'Data bundle 2GB', category: 'Data', amount: 'R 99.00' },
  { date: '23 Oct', item: 'Lunch, campus cafe', category: 'Food', amount: 'R 48.00' },
  { date: '22 Oct', item: 'Printing, library', category: 'Education', amount: 'R 26.00' },
  { date: '21 Oct', item: 'Textbook, second hand', category: 'Education', amount: 'R 300.00' },
  { date: '20 Oct', item: 'Airtime top up', category: 'Data', amount: 'R 60.00' },
  { date: '19 Oct', item: 'Bus fare', category: 'Transport', amount: 'R 25.00' },
];
*/

const categoryData = [
  { name: 'Food', amount: 'R 668.00', percentage: '100%' },
  { name: 'Transport', amount: 'R 340.00', percentage: '55%' },
  { name: 'Data and airtime', amount: 'R 159.00', percentage: '25%' },
  { name: 'Education', amount: 'R 183.00', percentage: '30%' },
];

type Expenses = {
  date: Date,
  item: string,
  category: string,
  amount: number
}

const Expenses: React.FC = () => {


  const [userExpenses, setUserExpenses] = useState<Expenses[]>([]);
  const [totalAmountForExpenses, setTotalAmountForExpense] = useState<number>(0);
  const [filtered, setFiltered] = useState<Expenses[]>([]);
  const [search, setSearch] = useState<String>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String | null>(null);
  const navigate = useNavigate();

  const navigatePage = (path: string) => {

    navigate("/" + path);

  }

  const fetchUserExpenses = async () => {

    try {

      setLoading(true);

      const uid = getAuth().currentUser?.uid || "";
      const ref = doc(db, "expenses", uid);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
          console.error("Error occured: No database document found");
          setError("Error occured: No database document found");
          return false;
      }

      const data = snapshot.data() as Expenses[];

      setUserExpenses(data);

      let total = 0;

      userExpenses.forEach(e => {

        total = total + e.amount;

      });

      setTotalAmountForExpense(total);


    } catch (e) {

      console.log("Error occured: " + e);

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    try {

      fetchUserExpenses();

    } catch (e) {

      console.log("Error occured: " + e);

    } 

  }, []);



  useEffect(() => {

    try {

      let list = [...userExpenses];

      if (search.trim()) {
        const s = search.toLowerCase();
        list = list.filter((b: any) =>
        (b.courseTitle || "").toLowerCase().includes(s) ||
        (b.companyName || "").toLowerCase().includes(s) ||
        (b.facilitatorName || "").toLowerCase().includes(s)
        );
      }

      setFiltered(list);

    } catch (e) {

      console.log("Error occured: " + e);

    } 

  }, [search]);


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
                  <th>Item</th>
                  <th>Category</th>
                  <th className={styles.textRight}>Amount</th>
                  <th className={styles.textRight}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading ? (
                  <>
                  {/*
                  {expensesData.map((expense, index) => (
                    <tr key={index}>
                      <td className={styles.textMuted}>{expense.date}</td>
                      <td className={styles.textDark}>{expense.item}</td>
                      <td className={styles.textMuted}>{expense.category}</td>
                      <td className={`${styles.textRight} ${styles.textBold}`}>
                        {expense.amount}
                      </td>
                      <td className={styles.textRight}>
                        <button className={styles.editLink}>Edit</button>
                      </td>
                    </tr>
                  ))}
                  */}
  
  
                  {(filtered.entries.length != 0 ? filtered : userExpenses).map((expense, index) => (
                    <tr key={index}>
                      <td className={styles.textMuted}>{expense.date.toDateString()}</td>
                      <td className={styles.textDark}>{expense.item}</td>
                      <td className={styles.textMuted}>{expense.category}</td>
                      <td className={`${styles.textRight} ${styles.textBold}`}>
                        {expense.amount}
                      </td>
                      {/*
                      <td className={styles.textRight}>
                        <button className={styles.editLink}>Edit</button>
                      </td>
                      */}
                    </tr>
                  ))}
                  </>
                )
                :
                (
                  <>Loading expenses...</>
                )}
              </tbody>
            </table>
          </div>
          
          <div className={styles.pagination}>
            <span className={styles.textMuted}>Showing 8 of 34 expenses</span>
            <button className={styles.nextPageBtn}>Next page</button>
          </div>
        </div>

        {/* Right Column: Category Summary */}
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Expenses by category</h3>
          
          <div className={styles.categoryList}>
            {categoryData.map((cat, index) => (
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
              </div>
            ))}
          </div>

          <div className={styles.summaryFooter}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>R {totalAmountForExpenses}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Expenses;