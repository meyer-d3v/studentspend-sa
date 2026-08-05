import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Income.module.css";

const Income: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        
    });
    const [error, setError] = useState<string>();

    const nextPage = (path: string) => {
        navigate("/" + path);
    };

    

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                
                <div className={styles.stepIndicator}>STEP 4 OF 5</div>
                <h1 className={styles.title}>What comes in each month?</h1>
                <p className={styles.subtitle}>Your budget is built from this figure.</p>

                <form className={styles.form}>
                
                <div className={styles.incomeList}>
                    
                    {/* NSFAS Allowance Item */}
                    <div className={styles.incomeItem}>
                    <div className={styles.itemDetails}>
                        <h4 className={styles.itemTitle}>NSFAS allowance</h4>
                        <p className={styles.itemDescription}>Living and personal care, paid monthly</p>
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                        type="text" 
                        className={styles.amountInput} 
                        defaultValue="1 800" 
                        />
                    </div>
                    </div>

                    {/* Part-time Work Item */}
                    <div className={styles.incomeItem}>
                    <div className={styles.itemDetails}>
                        <h4 className={styles.itemTitle}>Part-time work</h4>
                        <p className={styles.itemDescription}>Tutoring, retail, campus jobs</p>
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                        type="text" 
                        className={styles.amountInput} 
                        defaultValue="1 100" 
                        />
                    </div>
                    </div>

                    {/* Family Support Item */}
                    <div className={styles.incomeItem}>
                    <div className={styles.itemDetails}>
                        <h4 className={styles.itemTitle}>Family support</h4>
                        <p className={styles.itemDescription}>Money sent from home</p>
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                        type="text" 
                        className={styles.amountInput} 
                        defaultValue="3 400" 
                        />
                    </div>
                    </div>

                </div>

                {/* Total Summary Box */}
                <div className={styles.totalBox}>
                    <span className={styles.totalLabel}>Total monthly income</span>
                    <span className={styles.totalAmount}>R 6 700.00</span>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => nextPage("budget")}>
                    Continue
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => nextPage("verification")}>
                    Back
                    </button>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Income;