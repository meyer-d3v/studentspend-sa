import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Budget.module.css";

const Budget: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        
    });
    const [error, setError] = useState<string>();
    const categories = [
        { name: 'Transport', amount: 'R 900', percentage: 35 },
        { name: 'Food', amount: 'R 1 800', percentage: 75 },
        { name: 'Rent', amount: 'R 2 200', percentage: 100 },
        { name: 'Data and airtime', amount: 'R 400', percentage: 15 },
        { name: 'Groceries', amount: 'R 500', percentage: 20 },
        { name: 'Other', amount: 'R 200', percentage: 10 },
    ];

    const nextPage = (path: string) => {
        navigate("/" + path);
    };

    

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                
                <div className={styles.stepIndicator}>STEP 5 OF 5</div>
                <h1 className={styles.title}>Set your spending limits</h1>
                <p className={styles.subtitle}>Keep a little back so the end of the month is not a surprise.</p>

                <form className={styles.form}>
                
                <div className={styles.limitsRow}>
                    {/* Monthly Limit Card */}
                    <div className={styles.limitCard}>
                    <h4 className={styles.cardTitle}>Monthly limit</h4>
                    <p className={styles.cardSubtitle}>Out of R 6 700.00 income</p>
                    
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                        type="text" 
                        className={styles.amountInput} 
                        defaultValue="6 000" 
                        />
                    </div>
                    </div>

                    {/* Weekly Limit Card */}
                    <div className={`${styles.limitCard} ${styles.limitCardHighlighted}`}>
                    <h4 className={styles.cardTitle}>Weekly limit</h4>
                    <p className={styles.cardSubtitle}>Worked out for you, over 4 weeks</p>
                    
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                        type="text" 
                        className={`${styles.amountInput} ${styles.highlightedInput}`} 
                        defaultValue="1 500" 
                        />
                    </div>
                    </div>
                </div>

                <div className={styles.splitSection}>
                    <div className={styles.splitHeader}>
                    <h3 className={styles.splitTitle}>Split the R 6 000 between your categories</h3>
                    <span className={styles.remainingText}>R 0 left to allocate</span>
                    </div>

                    <div className={styles.categoriesGrid}>
                    {categories.map((cat, index) => (
                        <div key={index} className={styles.categoryItem}>
                        <div className={styles.categoryHeader}>
                            <span className={styles.categoryName}>{cat.name}</span>
                            <span className={styles.categoryAmount}>{cat.amount}</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div 
                            className={styles.progressFill} 
                            style={{ width: `${cat.percentage}%` }}
                            ></div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => nextPage("finish")}>
                    Finish setup
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => nextPage("income")}>
                    Back
                    </button>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Budget;