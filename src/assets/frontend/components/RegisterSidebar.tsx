import React from "react";
import styles from "../styles/SidebarStyles/RegisterSidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const RegisterSidebar: React.FC<SidebarProps> = () => {


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