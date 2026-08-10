import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SidebarStyles/MainSidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const MainSidebar: React.FC<SidebarProps> = ({ isOpen }) => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>("dashboard");

    const navigateToPage = (path: string) => {

      navigate("/" + path);

    }; 
  



    return (

        <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        
        <div className={styles.headerSection}>
          <p className={styles.greeting}>Welcome, (name)</p>
          
          <div className={styles.balanceSection}>
            <p className={styles.balanceLabel}>BALANCE LEFT</p>
            <h2 className={styles.balanceAmount}>R 5 350.00</h2>
            
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarFill} style={{ width: '22%' }}></div>
            </div>
            
            <p className={styles.progressText}>22% of your monthly limit used</p>
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