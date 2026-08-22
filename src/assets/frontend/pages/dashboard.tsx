import React, { useEffect, useState } from 'react';
import styles from "../styles/Dashboard.module.css";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { doc, getDoc } from 'firebase/firestore';

type Expenses = {
  date: Date,
  item: string,
  category: string,
  amount: number
}

const Dashboard: React.FC = () => {

  // Budget Data
  const budgetCardsData = [
    { title: 'Food', amount: '620', allocated: '1 800', spentPercentage: (620 / 1800) * 100 },
    { title: 'Transport', amount: '340', allocated: '900', spentPercentage: (340 / 900) * 100 },
    { title: 'Data and airtime', amount: '199', allocated: '400', spentPercentage: (199 / 400) * 100 },
    { title: 'Groceries', amount: '190', allocated: '500', spentPercentage: (190 / 500) * 100 },
  ];

  // Expenses Data
  const expenses = [
    { date: '26 Oct', item: 'Groceries at Shoprite', category: 'Groceries', amount: '190.00' },
    { date: '25 Oct', item: 'Taxi to campus', category: 'Transport', amount: '34.00' },
    { date: '24 Oct', item: 'Data bundle 2GB', category: 'Data', amount: '99.00' },
    { date: '23 Oct', item: 'Lunch, campus cafe', category: 'Food', amount: '48.00' },
  ];

  const [userExpenses, setUserExpenses] = useState<Array<Expenses>>([]);
  const [loading, setLaoding] = useState<Boolean>(false);

  const navigate = useNavigate();

  const navigateToPage = (path: string) => {
    navigate("/" + path);
  };

  const getUserData = async () => {

    try {

      setLaoding(true);

      const uid = getAuth().currentUser?.uid || "";
      const ref = doc(db, "expenses", uid);
      const snapshot = await getDoc(ref);


      const data = snapshot?.data() as unknown as Array<Expenses>;

      setUserExpenses(data || []);

      setLaoding(false);

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
    
      <div className={styles.dashboardContainer}>
        
        {/* Top Row: Budget Cards Grid */}
        <div className={styles.budgetCardsGrid}>
          {budgetCardsData.map((data, index) => (
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

                    {userExpenses.map((expense, index) => (
                      <tr key={index} className={styles.tableDataRow}>
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
                Track the small buys. Airtime and vetkoek add up faster than rent.
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    );
};

export default Dashboard;
//npm run make