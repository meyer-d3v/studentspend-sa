import React, { useEffect, useState } from "react";
import styles from "../styles/SidebarStyles/RegisterSidebar.module.css";
import { useLocation } from "react-router-dom";
import { Check } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const RegisterSidebar: React.FC<SidebarProps> = () => {


  const [currentPage, setCurrentPage] = useState<string>("account");
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const location = useLocation();

  const findCurrentPage = () => {

    switch (location.pathname) {

      case "/account": 
        setCurrentPage("account");
        setCurrentPageIndex(1);
        return;

      case "/details":
        setCurrentPage("details");
        setCurrentPageIndex(2);
        return;

      case "/verification":
        setCurrentPage("verification");
        setCurrentPageIndex(3);
        return;

      case "/income":
        setCurrentPage("income");
        setCurrentPageIndex(4);
        return;

      case "/budget":
        setCurrentPage("budget");
        setCurrentPageIndex(5);
        return;
    } 

  }
  
  const completedStep = () => {

    return <>
    
      <div className={`${styles.stepItem} ${styles.completedStep}`}>
        <div className={styles.stepIndicator}>
          <Check size={16} strokeWidth={3} />
        </div>
        <span className={styles.stepLabel}>Account</span>
      </div>
    </>
  }

  useEffect(() => {

    findCurrentPage();

  }, [location]);


  return (

    <aside className={styles.sidebar}>
      <div className={styles.brandGroup}>
        <div className={styles.logoIcon}></div>
        <span className={styles.brandName}>StudentSpend SA</span>
      </div>

      <nav className={styles.stepperNav}>

        {currentPageIndex >= 2  ? (
          completedStep()
        )
        :
        (
          <div className={`${styles.stepItem} ${currentPage === "account" && styles.activeStep}`}>
            <div className={styles.stepIndicator}>1</div>
            <span className={styles.stepLabel}>Account</span>
          </div>
        )}
        
        {currentPageIndex >= 3 ? (
          completedStep()
        )
        :
        (
          <div className={`${styles.stepItem} ${currentPage === "details" && styles.activeStep}`}>
            <div className={styles.stepIndicator}>2</div>
            <span className={styles.stepLabel}>Your details</span>
          </div>
        )}
        
        {currentPageIndex >= 4 ? (
          completedStep()
        )
        :
        (
          <div className={`${styles.stepItem} ${currentPage === "verification" && styles.activeStep}`}>
            <div className={styles.stepIndicator}>3</div>
            <span className={styles.stepLabel}>Verification</span>
          </div>
        )}
        
        {currentPageIndex >= 5 ? (
          completedStep()
        )
        :
        (
          <div className={`${styles.stepItem} ${currentPage === "income" && styles.activeStep}`}>
            <div className={styles.stepIndicator}>4</div>
            <span className={styles.stepLabel}>Income</span>
          </div>
        )}
        
        <div className={`${styles.stepItem} ${currentPage === "budget" && styles.activeStep}`}>
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