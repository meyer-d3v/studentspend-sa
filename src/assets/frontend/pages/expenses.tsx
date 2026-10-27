import React, { useEffect, useState } from 'react';
import styles from "../styles/Expenses.module.css";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDocs, query, where, collection, deleteDoc, doc } from 'firebase/firestore';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { Trash2 } from 'lucide-react';
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


const categoryData = [
  { name: 'Food', amount: 'R 0.00', percentage: '0%' },
  { name: 'Transport', amount: 'R 0.00', percentage: '0%' },
  { name: 'Data and airtime', amount: 'R 0.00', percentage: '0%' },
  { name: 'Education', amount: 'R 0.00', percentage: '0%' },
];
*/

type Expenses = {
  date: Date,
  item: string,
  category: string,
  amount: number
}

const Expenses: React.FC = () => {


  const [userExpenses, setUserExpenses] = useState<any>([]);
  const [categoryExpensesData, setCategoryExpensesData] = useState<any>([]);
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
      const ref = collection(db, "expenses");

      const expensesQuery = query(
        ref,
        where("userId", "==", uid)
      );
      
      const snapshot = await getDocs(expensesQuery);

      if (snapshot.empty) {
          console.error("No database document found");
          //setError("Error occured: No database document found");
          return false;
      }

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setUserExpenses(data);

      let total = 0;
      let categoryData = [
        { name: 'Food', amount: 0, percentage: 0 },
        { name: 'Transport', amount: 0, percentage: 0 },
        { name: 'Data and airtime', amount: 0, percentage: 0 },
        { name: 'Groceries', amount: 0, percentage: 0 },
        { name: 'Other', amount: 0, percentage: 0 },
      ];

      userExpenses.forEach((e: any) => {

        total = total + e.amount;
        
        let categoryIndex = categoryData.findIndex(
          (c) => c.name.toLowerCase() === e.category.toLowerCase()
        );
    
        if (categoryIndex !== -1) {

          let newAmount = categoryData[categoryIndex].amount + e.amount;
          categoryData[categoryIndex].amount = newAmount.toFixed(2);

        } else if (e.category === "dataAndAirtime") {

          let targetCategory = categoryData.findIndex(c => c.name.toLowerCase() === "data and airtime") || -1;

          let newAmount = categoryData[targetCategory].amount + e.amount;
          categoryData[categoryIndex].amount = newAmount.toFixed(2);

        }

      });

      setCategoryExpensesData(categoryData as any);

      setTotalAmountForExpense(total);




    } catch (e) {

      console.log("Error occured: " + e);
      setError("Error occured: " + e);

    } finally {

      setLoading(false);

    }

  }

  const deleteExpense = async (id: string) => {

    try {

      const ref = doc(db, "expenses", id);

      await deleteDoc(ref);

      fetchUserExpenses();

    } catch (e) {

      setError("Error occured trying to delete expense. Error: " + e);

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
                  <th>Category</th>
                  <th>Description</th>
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
  
  
                  {(filtered.entries.length != 0 ? filtered : userExpenses).map((expense: any, index: any) => (
                    <tr key={index}>
                      <td className={styles.textMuted}>
                      {
                        expense.date?.toDate 
                          ? expense.date.toDate().toDateString() 
                          : new Date(expense.date).toDateString()
                      }
                      </td>
                      <td className={styles.textMuted}>{expense.category}</td>
                      <td className={styles.textDark}>{expense.description}</td>
                      <td className={`${styles.textRight} ${styles.textBold}`}>
                        {expense.amount}
                      </td>
                      
                      {/* replace with icon */}
                      <td className={styles.textRight}>
                        <button 
                          className={styles.editLink}
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 />
                        </button>
                      </td>
                      
                    </tr>
                  ))}
                  </>
                )
                :
                (
                  <tr>
                    <td>Loading expenses...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className={styles.pagination}>
            
              <span className={styles.textMuted}>Showing {userExpenses.length} expenses</span>
              {/*<button className={styles.nextPageBtn}>Next page</button>*/}
            
          </div>
        </div>

        {/* Right Column: Category Summary */}
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Expenses by category</h3>
          
          {/*
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
          */}

            <div className={styles.categoryList}>
              {categoryExpensesData ? (
                <>
                  {categoryExpensesData.map((cat: any, index: number) => (
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
                </>
              )
              :
              (
                <>
                  <div className={styles.categoryItem}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryName}>No expenses found</span>
                      <span className={styles.categoryAmount}></span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: "" }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
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