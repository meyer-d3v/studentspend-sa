import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SidebarStyles/MainSidebar.module.css";
import { getDoc, doc } from "firebase/firestore";
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { getAuth } from "firebase/auth";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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


const MainSidebar: React.FC<SidebarProps> = ({ isOpen }) => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [userDetails, setUserDetails] = useState({
      firstname: "",
      balanceLeft: 0,
      totalBalance: 0,
    });

    const navigateToPage = (path: string) => {

      navigate("/" + path);

    }; 

    const getUserDetails = async () => {

      try {

        const uid = getAuth().currentUser?.uid || "";

        if (!uid) {
          console.log("No user is logged in");
          return;
        }
        const ref = doc(db, "users", uid);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
            console.error("Error occured: No database document found");
            return;
        }

        const data = snapshot.data() as { firstName?: string, income?: { totalIncome?: number } };

        setUserDetails((prev) => ({
            ...prev,
            firstname: (", " + data.firstName) || "",
            totalBalance: data.income?.totalIncome || 0,
        }));

      } catch (e) {

        console.log("Error occured: " + e);

      }

    }

    const getUserBalance = async () => {

      try {

        const uid = getAuth().currentUser?.uid || "";
        const budgetRef = doc(db, "budget_planner", uid);
        const budgetSnapshot = await getDoc(budgetRef);
  
        const data = budgetSnapshot.data() as BudgetPlanner || null;

        if (!data) {
          return;
        }

        const balanceLeft = (
          data.spentTotals.dataAndAirtime +
          data.spentTotals.food +
          data.spentTotals.groceries +
          data.spentTotals.other +
          data.spentTotals.rent +
          data.spentTotals.transport
        );

        setUserDetails((prev) => ({
          ...prev,
          balanceLeft: balanceLeft,
        }))


      } catch (e) {

        console.log("Error occured getting balance. Error: " + e);
      }
    }

    useEffect(() => {

      try {

        getUserDetails();
        getUserBalance();


      } catch (e) {

        console.log("Error occured: " + e);

      }

    }, []);
  



    return (

        <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        
        <div className={styles.headerSection}>
          <p className={styles.greeting}>Welcome {userDetails.firstname}</p>
          
          <div className={styles.balanceSection}>
            <p className={styles.balanceLabel}>BALANCE LEFT</p>
            <h2 className={styles.balanceAmount}>R 0</h2>
            
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarFill} style={{ width: `${((userDetails.balanceLeft / userDetails.totalBalance) * 100).toFixed(2)}%` }}></div>
            </div>
            
            <p className={styles.progressText}>0% of your monthly limit used</p>
          </div>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "dashboard" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("dashboard")
                navigateToPage("dashboard")
              }}
            >
              Dashboard
            </li>

            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "addExpenses" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("addExpenses")
                navigateToPage("addExpenses")
              }}
            >
              Add expense
            </li>

            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "expenses" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("expenses")
                navigateToPage("expenses")
              }}
            >
              Expenses
            </li>

            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "budgetPlanner" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("budgetPlanner")
                navigateToPage("budgetPlanner")
              }}
            >
              Budget planner
            </li>
            
            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "financialTips" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("financialTips")
                navigateToPage("financialTips")
              }}
            >
              Financial tips
            </li>
            
            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "alerts" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("alerts")
                navigateToPage("alerts")
              }}
            >
              Alerts
            </li>

            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "reports" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("reports")
                navigateToPage("reports")
              }}
            >
              Reports
            </li>
            <li 
              className={`
                ${styles.navItem} 
                ${activeTab === "settings" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("settings")
                navigateToPage("settings")
              }}
            >
              Account
            </li>
          </ul>
        </nav>


    
      </div>
    )
    
}

export default MainSidebar;