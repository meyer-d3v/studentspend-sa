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
import styles from "../styles/SidebarStyles/RegisterSidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const RegisterSidebar: React.FC<SidebarProps> = () => {

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

      <aside className={styles.sidebar}>
      <div className={styles.brandGroup}>
        <div className={styles.logoIcon}></div>
        <span className={styles.brandName}>StudentSpend SA</span>
      </div>

      <nav className={styles.stepperNav}>
        <div className={`${styles.stepItem} ${styles.activeStep}`}>
          <div className={styles.stepIndicator}>1</div>
          <span className={styles.stepLabel}>Account</span>
        </div>
        
        <div className={styles.stepItem}>
          <div className={styles.stepIndicator}>2</div>
          <span className={styles.stepLabel}>Your details</span>
        </div>
        
        <div className={styles.stepItem}>
          <div className={styles.stepIndicator}>3</div>
          <span className={styles.stepLabel}>Verification</span>
        </div>
        
        <div className={styles.stepItem}>
          <div className={styles.stepIndicator}>4</div>
          <span className={styles.stepLabel}>Income</span>
        </div>
        
        <div className={styles.stepItem}>
          <div className={styles.stepIndicator}>5</div>
          <span className={styles.stepLabel}>Budget</span>
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <p>Takes about two minutes. You can change every number later.</p>
      </div>
    </aside>
    )
    
}

export default RegisterSidebar;