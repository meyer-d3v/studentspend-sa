import React from "react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { 
    Calendar, 
    LayoutDashboard,
    MessageSquare, 
    Users,
    BookKeyIcon,
    Settings,
    X as Xicon,
    Menu as MenuIcon,
} from "lucide-react";
import styles from "../styles/SidebarStyles/MainSidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const MainSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen}) => {

    const navigate = useNavigate();
    //const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    //const [role, setRole] = useState<string | null>(null);
    
    

    const signOut = () => {
        navigate("/", { replace: true });
    }

    function getFormattedDate(date: Date): string {
      return date.toLocaleDateString("en-US", {
        weekday: "long",   // Sunday
        year: "numeric",   // 2025
        month: "long",     // September
        day: "numeric"     // 21
      });
    }

    const getDate = () => {
      const today = new Date();
      let date = getFormattedDate(today);
      return date;
    }

    const getYear = () => {
      const now = new Date();
      var fullYear = now.getFullYear().toString();
      return fullYear;
    }

    const nextPage = (pageName: string) => {
      const name = "/" + pageName;
      navigate(name, { replace: true });
      //setIsOpen(false);
    }

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
                ${activeTab === "addExpense" && styles.active}
              `} 
              
              onClick={() => {
                setActiveTab("addExpense")
                navigateToPage("")
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
                navigateToPage("")
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
                navigateToPage("")
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
                navigateToPage("")
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
                navigateToPage("")
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
              }}
            >
              Reports
            </li>
          </ul>
        </nav>
    
      </div>
    )
    
}

export default MainSidebar;