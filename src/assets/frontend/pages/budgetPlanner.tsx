import React, { useEffect, useState } from 'react';
import styles from "../styles/BudgetPlanner.module.css";
import { getAuth } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { LoaderCircle } from 'lucide-react';

/*
const categories = [
  { name: 'Transport', percentage: '15', amount: '0' },
  { name: 'Food', percentage: '30', amount: '0' },
  { name: 'Rent', percentage: '37', amount: '0' },
  { name: 'Data and airtime', percentage: '7', amount: '0' },
  { name: 'Groceries', percentage: '8', amount: '0' },
  { name: 'Other', percentage: '3', amount: '0' },
];
*/

const BudgetPlanner: React.FC = () => {

  const [userData, setUserData] = useState({
    monthlyIncome: 0,
    monthlyLimit: 0,
    weeklyLimit: 0,
    catagoryAllocations: {
      transport: 0,
      food: 0, 
      rent: 0,
      dataAndAirtime: 0,
      groceries: 0,
      other: 0,
    }
  });

  const [activeToggle, setActiveToggle] = useState<String>("weekly");
  const [loading, setLoading] = useState<boolean>(false);


  const getUserInformation = async () => {

    try {

      const uid = getAuth().currentUser?.uid || "";
      const ref = doc(db, "users", uid);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
          console.error("Error occured: No database document found");
          //setError("Error occured: No database document found");
          return false;
      }

      const data = snapshot.data() as { email?: string, income?: { totalIncome?: number, weeklyIncome?: number }, limit?: { monthlyLimit: number }  };

      setUserData((prev) => ({
          ...prev,
          monthlyIncome: data.income?.totalIncome || 0,
          weeklyIncome: data.income?.weeklyIncome || 0,
          monthlyLimit: data.limit?.monthlyLimit || 0
      }));

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }

  const getUserBudget = async () => {

    try {

      const uid = getAuth().currentUser?.uid || "";
      const ref = doc(db, "budget_planner", uid);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
          console.error("Error occured: No database document found");
          //setError("Error occured: No database document found");
          return false;
      }

      const data = snapshot.data() as {
        transport: number,
        food: number, 
        rent: number,
        dataAndAirtime: number,
        groceries: number,
        other: number,
      };

      setUserData((prev) => ({
          ...prev,
          catagoryAllocations: {
            transport: data.transport,
            food: data.food, 
            rent: data.rent,
            dataAndAirtime: data.dataAndAirtime,
            groceries: data.groceries,
            other: data.other,
          }
      }));

    } catch (e) {

      console.log("Error occured: " + e);

    }

  }

  const saveBudget = async () => {

    try {

      setLoading(true);

      const uid = getAuth().currentUser?.uid || "";
      const ref = doc(db, "budget_planner", uid);
      await setDoc(ref, {
        
        transport: userData.catagoryAllocations.transport,
        food: userData.catagoryAllocations.food, 
        rent: userData.catagoryAllocations.rent,
        dataAndAirtime: userData.catagoryAllocations.dataAndAirtime,
        groceries: userData.catagoryAllocations.groceries,
        other: userData.catagoryAllocations.groceries,
        
      });

      setLoading(false);


    } catch (e) {

      alert("Error occured. Error: " + e);


    } finally {

      console.log("Data saved successfully");
      setLoading(false);
      
    }

  };

  const resetBudget = async () => {

    try {

      await getUserBudget();

    } catch (e) {

      console.log("Error retrieving user budget. Error: " + e);

    }

  };



  useEffect(() => {


    try {

      getUserInformation();
      getUserBudget();

    } catch (e) {

      console.log("Error retrieving user budget. Error: " + e);

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
          <span className={styles.cardLabel}>Total budget {userData.monthlyLimit === 0 && "(Please set a monthly limit before assigning categories)"}</span>
          <div className={styles.inputGroupLarge}>
            <span className={styles.currencyPrefix}>R</span>
            <input 
              type="text" 
              className={styles.amountInput} 
              value={userData.monthlyLimit} 
              onChange={(e) => {
                
                let newValue = parseInt(e.target.value);
                if (isNaN(newValue)) {
                  newValue = 0;
                }

                if (newValue > userData.monthlyIncome) {
                  alert("Budget cannot be more than income.")
                  return;
                }

                setUserData((prev) => ({
                ...prev,
                monthlyLimit: parseInt(e.target.value),
                weeklyLimit: (parseInt(e.target.value) / 4)
              }))}}
              placeholder={userData.monthlyLimit !== 0 ? userData.monthlyLimit.toString() : "0"} 
            />
          </div>
        </div>

        {/* Weekly Limit Card */}
        {activeToggle === "monthly" ? (
          <>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Monthly limit, calculated</span>
              <div className={`${styles.cardValueLarge} ${styles.textBlue}`}>R {userData.monthlyLimit}</div>
            </div>
          </>
        )
        : 
        (
          <div className={styles.card}>
            <span className={styles.cardLabel}>Weekly limit, calculated</span>
            <div className={`${styles.cardValueLarge} ${styles.textBlue}`}>R {userData.monthlyIncome / 4}</div>
          </div>
        )}

      </div>

      {/* Main Panel: Category Allocations */}
      <div className={styles.mainPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Category allocations</h2>
          <span className={styles.textGreen}>R 
            {(userData.monthlyLimit - 
              userData.catagoryAllocations.dataAndAirtime -
              userData.catagoryAllocations.food -
              userData.catagoryAllocations.groceries -
              userData.catagoryAllocations.rent -
              userData.catagoryAllocations.transport -
              userData.catagoryAllocations.other) >= 0 ?
            
              (userData.monthlyLimit - 
                userData.catagoryAllocations.dataAndAirtime -
                userData.catagoryAllocations.food -
                userData.catagoryAllocations.groceries -
                userData.catagoryAllocations.rent -
                userData.catagoryAllocations.transport -
                userData.catagoryAllocations.other)
              :
              0
            } left to allocate</span>
        </div>

        <div className={styles.categoryGrid}>
          {/*}
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
            */}

          
            <div className={styles.categoryItem}>
              <div className={styles.categoryLeft}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>Transport</span>
                  <span className={styles.categoryPercent}>{userData.catagoryAllocations.transport !== 0 ? ((userData.catagoryAllocations.transport / userData.monthlyLimit) * 100 ).toFixed(2) : 0}% of budget</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${userData.catagoryAllocations.transport !== 0 ? ((userData.catagoryAllocations.transport / userData.monthlyLimit) * 100 ).toFixed(2) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.categoryRight}>
                <div className={styles.inputGroupSmall}>
                  <span className={styles.currencyPrefix}>R</span>
                  <input 
                    type="text" 
                    className={styles.amountInput} 
                    placeholder={userData.catagoryAllocations.transport.toString()} 

                    onChange={(e) => {

                      //console.log("Input: " + e.target.valueAsNumber + parseInt(e.target.value))

                      let newValue = parseInt(e.target.value);
                      if (isNaN(newValue)) {
                          newValue = 0;
                      }

                      setUserData((prev) => ({
                        ...prev,
                        catagoryAllocations: {
                          ...prev.catagoryAllocations,
                          transport: newValue
                        }
                      }))
                      
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.categoryItem}>
              <div className={styles.categoryLeft}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>Food</span>
                  <span className={styles.categoryPercent}>{userData.catagoryAllocations.food !== 0 ? ((userData.catagoryAllocations.food / userData.monthlyLimit) * 100 ).toFixed(2) : 0}% of budget</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${userData.catagoryAllocations.food !== 0 ? ((userData.catagoryAllocations.food / userData.monthlyLimit) * 100 ).toFixed(2) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.categoryRight}>
                <div className={styles.inputGroupSmall}>
                  <span className={styles.currencyPrefix}>R</span>
                  <input 
                    type="text" 
                    className={styles.amountInput} 
                    placeholder={userData.catagoryAllocations.food.toString()} 

                    onChange={(e) => {

                      //console.log("Input: " + e.target.valueAsNumber + parseInt(e.target.value))

                      let newValue = parseInt(e.target.value);
                      if (isNaN(newValue)) {
                          newValue = 0;
                      }

                      setUserData((prev) => ({
                        ...prev,
                        catagoryAllocations: {
                          ...prev.catagoryAllocations,
                          food: newValue
                        }
                      }))
                      
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.categoryItem}>
              <div className={styles.categoryLeft}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>Data and Airtime</span>
                  <span className={styles.categoryPercent}>{userData.catagoryAllocations.dataAndAirtime !== 0 ? ((userData.catagoryAllocations.dataAndAirtime / userData.monthlyLimit) * 100 ).toFixed(2) : 0}% of budget</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${userData.catagoryAllocations.dataAndAirtime !== 0 ? ((userData.catagoryAllocations.dataAndAirtime / userData.monthlyLimit) * 100 ).toFixed(2) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.categoryRight}>
                <div className={styles.inputGroupSmall}>
                  <span className={styles.currencyPrefix}>R</span>
                  <input 
                    type="text" 
                    className={styles.amountInput} 
                    placeholder={userData.catagoryAllocations.dataAndAirtime.toString()} 

                    onChange={(e) => {

                      //console.log("Input: " + e.target.valueAsNumber + parseInt(e.target.value))

                      let newValue = parseInt(e.target.value);
                      if (isNaN(newValue)) {
                          newValue = 0;
                      }

                      setUserData((prev) => ({
                        ...prev,
                        catagoryAllocations: {
                          ...prev.catagoryAllocations,
                          dataAndAirtime: newValue
                        }
                      }))
                      
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.categoryItem}>
              <div className={styles.categoryLeft}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>Groceries</span>
                  <span className={styles.categoryPercent}>{userData.catagoryAllocations.groceries !== 0 ? ((userData.catagoryAllocations.groceries / userData.monthlyLimit) * 100 ).toFixed(2) : 0}% of budget</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${userData.catagoryAllocations.groceries !== 0 ? ((userData.catagoryAllocations.groceries / userData.monthlyLimit) * 100 ).toFixed(2) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.categoryRight}>
                <div className={styles.inputGroupSmall}>
                  <span className={styles.currencyPrefix}>R</span>
                  <input 
                    type="text" 
                    className={styles.amountInput} 
                    placeholder={userData.catagoryAllocations.groceries.toString()} 

                    onChange={(e) => {

                      //console.log("Input: " + e.target.valueAsNumber + parseInt(e.target.value))

                      let newValue = parseInt(e.target.value);
                      if (isNaN(newValue)) {
                          newValue = 0;
                      }

                      setUserData((prev) => ({
                        ...prev,
                        catagoryAllocations: {
                          ...prev.catagoryAllocations,
                          groceries: newValue
                        }
                      }))
                      
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.categoryItem}>
              <div className={styles.categoryLeft}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>Other</span>
                  <span className={styles.categoryPercent}>{userData?.monthlyLimit > 0 && userData?.catagoryAllocations.other > 0
                    ? ((userData?.catagoryAllocations.other / userData?.monthlyLimit) * 100).toFixed(2) 
                    : "0"}% of budget</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${userData.catagoryAllocations.other !== 0 ? ((userData.catagoryAllocations.other / userData.monthlyLimit) * 100 ).toFixed(2) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.categoryRight}>
                <div className={styles.inputGroupSmall}>
                  <span className={styles.currencyPrefix}>R</span>
                  <input 
                    type="text" 
                    className={styles.amountInput} 
                    placeholder={userData.catagoryAllocations.other.toString()} 

                    onChange={(e) => {

                      //console.log("Input: " + e.target.valueAsNumber + parseInt(e.target.value))

                      let newValue = parseInt(e.target.value);
                      if (isNaN(newValue)) {
                          newValue = 0;
                      }

                      setUserData((prev) => ({
                        ...prev,
                        catagoryAllocations: {
                          ...prev.catagoryAllocations,
                          other: newValue
                        }
                      }))
                      
                    }}
                  />
                </div>
              </div>
            </div>

        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button 
            className={styles.primaryBtn} 
            onClick={() => 
              saveBudget()
            }
          >
            {loading !== true ? (
              <>
                Save budget
              </>
            )
            :
            (
              <LoaderCircle size={16} className={styles.loaderCircle} />
            )
            }
          </button>
          <button className={styles.secondaryBtn} onClick={() => resetBudget()}>Reset to last saved</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;