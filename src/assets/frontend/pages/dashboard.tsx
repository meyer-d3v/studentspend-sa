import React, { useEffect, useState } from 'react';
import styles from "../styles/Dashboard.module.css";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

type Expenses = {
  id: string,
  date: Date,
  item: string,
  category: string,
  amount: number
}

type BudgetCards = {
  title: string,
  amount: number,
  allocated: number,
  spentPercentage: number,
}

type BudgetPlanner = {
  transport: number,
  food: number, 
  rent: number,
  dataAndAirtime: number,
  groceries: number,
  other: number,
  spentTotals: {
    transport: number,
    food: number, 
    rent: number,
    dataAndAirtime: number,
    groceries: number,
    other: number,
  }
}

const Dashboard: React.FC = () => {

  // Budget Data
  /*
  const budgetCardsData = [
    { title: 'Food', amount: '620', allocated: '1 800', spentPercentage: (620 / 1800) * 100 },
    { title: 'Transport', amount: '340', allocated: '900', spentPercentage: (340 / 900) * 100 },
    { title: 'Data and airtime', amount: '199', allocated: '400', spentPercentage: (199 / 400) * 100 },
    { title: 'Groceries', amount: '190', allocated: '500', spentPercentage: (190 / 500) * 100 },
  ];
  */

  // Expenses Data
  const expenses = [
    { date: '26 Oct', item: 'Groceries at Shoprite', category: 'Groceries', amount: '190.00' },
    { date: '25 Oct', item: 'Taxi to campus', category: 'Transport', amount: '34.00' },
    { date: '24 Oct', item: 'Data bundle 2GB', category: 'Data', amount: '99.00' },
    { date: '23 Oct', item: 'Lunch, campus cafe', category: 'Food', amount: '48.00' },
  ];

  const emptyBudgetCardsData = [
    { title: 'Food', amount: 0, allocated: 0, spentPercentage: 0 },
    { title: 'Transport', amount: 0, allocated: 0, spentPercentage: 0 },
    { title: 'Data and airtime', amount: 0, allocated: 0, spentPercentage: 0 },
    { title: 'Groceries', amount: 0, allocated: 0, spentPercentage: 0 },
    { title: 'Other', amount: 0, allocated: 0, spentPercentage: 0 },
  ];

  const [userExpenses, setUserExpenses] = useState<Array<Expenses>>([]);
  const [userBudget, setUserBudget] = useState<Array<BudgetCards>>([]);
  const [loading, setLoading] = useState<Boolean>(false);

  const navigate = useNavigate();

  const navigateToPage = (path: string) => {
    navigate("/" + path);
  };

  const getUserBudget = async () => {

    try {

      setLoading(true);

      const uid = getAuth().currentUser?.uid || "";
      const budgetRef = doc(db, "budget_planner", uid);
      const budgetSnapshot = await getDoc(budgetRef);

      const data = budgetSnapshot.data() as BudgetPlanner || null;

      if (!data) return;


      setUserBudget([
        { 
          title: 'Food', 
          amount: data.spentTotals?.food, 
          allocated: data.food, 
          spentPercentage: (data.spentTotals.food / data.food) * 100 
        },
        { 
          title: 'Transport', 
          amount: data.spentTotals.transport, 
          allocated: data.transport, 
          spentPercentage: (data.spentTotals.transport / data.transport) * 100 },
        { 
          title: 'Data and airtime', 
          amount: data.spentTotals.dataAndAirtime, 
          allocated: data.dataAndAirtime, 
          spentPercentage: (data.spentTotals.dataAndAirtime / data.dataAndAirtime) * 100 },
        { 
          title: 'Groceries', 
          amount: data.spentTotals.groceries, 
          allocated: data.groceries, 
          spentPercentage: (data.spentTotals.groceries / data.groceries) * 100 
        },
        { 
          title: 'Other', 
          amount: data.spentTotals.other, 
          allocated: data.other, 
          spentPercentage: (data.spentTotals.other / data.other) * 100 
        },
      ])

      setLoading(false);

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }

  const getRecentExpenses = async () => {

    try {

      const uid = getAuth().currentUser?.uid;
      const ref = collection(db, "expenses")

      const expensesQuery = query(
        ref,
        where("userId", "==", uid),
        orderBy("createdAt", "desc"),
        limit(3)
      );

      const querySnapshot = await getDocs(expensesQuery);

      const recentExpenses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      setUserExpenses(recentExpenses as any);


    } catch (e) {

      console.log("Error occured trying to fetch recent expenses. Error: " + e);

    }

  }


  useEffect(() => {

    try {

      getUserBudget();
      getRecentExpenses();

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }, []);
  
    

  return (
    
      <div className={styles.dashboardContainer}>
        
        {/* Top Row: Budget Cards Grid */}
        <div className={styles.budgetCardsGrid}>
          {userBudget.length == 0 ? (
            <>
              {emptyBudgetCardsData.map((data, index) => (
                <div key={index} className={styles.budgetCard}>
                  <div className={styles.cardHeader}>{data.title}</div>
                  <div className={styles.cardAmount}>R {data.amount}</div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${data.spentPercentage}%` }}
                    ></div>
                  </div>
                  <div className={styles.cardAllocation}>of R {data.allocated} allocated</div>
                </div>
              ))}
            </>
          )
          :
          (
            <>
              {userBudget.map((data, index) => (
                <div key={index} className={styles.budgetCard}>
                  <div className={styles.cardHeader}>{data.title}</div>
                  <div className={styles.cardAmount}>R {data.amount}</div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${data.spentPercentage}%` }}
                    ></div>
                  </div>
                  <div className={styles.cardAllocation}>of R {data.allocated} allocated</div>
                </div>
              ))}
            </>
          )}
        </div>
  
        {/* Main Content Grid */}
        <div className={styles.mainContentGrid}>
          
          {/* Left Column: Recent Expenses Table */}
          <div className={styles.leftColumn}>
            <div className={styles.expensesCard}>
              <div className={styles.cardTitle}>Recent expenses</div>
              
              {loading ? (

                <>No expenses</>

              )
              :
              (
                <table className={styles.expensesTable}>
                  <thead>
                    <tr className={styles.tableHeaderRow}>
                      <th>DATE</th>
                      <th>ITEM</th>
                      <th>CATEGORY</th>
                      <th className={styles.amountHeader}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => (
                      <tr key={index} className={styles.tableDataRow}>
                        <td>{expense.date}</td>
                        <td className={styles.itemName}>{expense.item}</td>
                        <td className={styles.itemCategory}>{expense.category}</td>
                        <td className={styles.itemAmount}>R {expense.amount}</td>
                      </tr>
                    ))}

                    {userExpenses.map((expense) => (
                      <tr key={expense.id} className={styles.tableDataRow}>
                        <td>{expense.date.toDateString()}</td>
                        <td className={styles.itemName}>{expense.item}</td>
                        <td className={styles.itemCategory}>{expense.category}</td>
                        <td className={styles.itemAmount}>R {expense.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {userExpenses.length !== 0 && (
                <div className={styles.viewAllExpenses}>
                  <div onClick={() => navigateToPage("expenses")}>View all expenses</div>
                </div>
              )}
            </div>
          </div>
  
          {/* Right Column: Chart & Tip of the Day */}
          <div className={styles.rightColumn}>
            
            <div className={styles.chartCard}>
              <div className={styles.cardTitle}>This week</div>
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartStripesPattern}>
                  <div className={styles.chartPlaceholderText}>
                    <p>weekly spending chart</p>
                  </div>
                </div>
              </div>
            </div>
  
            <div className={styles.tipCard}>
              <div className={styles.tipTitle}>TIP OF THE DAY</div>
              <div className={styles.tipContent}>
                Track the small buys. Airtime and data add up faster than rent.
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    );
};

export default Dashboard;
//npm run make