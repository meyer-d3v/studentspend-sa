import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { db, auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Budget.module.css";
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';


const Budget: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        uid: "",
        email: "",
    });
    const [userIncomeData, setUserIncomeData] = useState({
        monthlyIncome: 0,
        monthlyLimit: 0,
        weeklyLimit: 0,
    });

    //const remainingBudget = userIncomeData;

    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    //const location = useLocation();
    //const derivedData = location.state;

    //if (derivedData) setUserData((prev) => ({ ...prev, monthlyIncome: derivedData?.monthlyIncome }))

    const categories = [
        { name: 'Transport', amount: 'R 900', percentage: 35 },
        { name: 'Food', amount: 'R 1 800', percentage: 75 },
        { name: 'Rent', amount: 'R 2 200', percentage: 100 },
        { name: 'Data and airtime', amount: 'R 400', percentage: 15 },
        { name: 'Groceries', amount: 'R 500', percentage: 20 },
        { name: 'Other', amount: 'R 200', percentage: 10 },
    ];

    const updateUserData = async () => {

        try {
        
            setLoading(true);

            const ref = doc(db, "users", userData.uid);

            await updateDoc(ref, {
                limits: {
                    monthlyLimit: userIncomeData.monthlyLimit,
                    weeklyLimit: userIncomeData.weeklyLimit,
                }
            });

            const criticalData = { 
                monthlyIncome: userIncomeData.monthlyIncome,
                monthlyLimit: userIncomeData.monthlyLimit,
                weeklyLimit: userIncomeData.weeklyLimit,
            };

            navigate("/finish", { state: criticalData });

        } catch (e) {

            setError("Error occured: " + e);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {

        const fetchUserEmail = async () => {
        
            try {
                const uid = getAuth().currentUser?.uid || "";
                const otpRef = doc(db, "users", uid);
                const otpSnap = await getDoc(otpRef);

                if (!otpSnap.exists()) {
                    console.error("Error occured: No database document found");
                    setError("Error occured: No database document found");
                    return;
                }

                const data = otpSnap.data() as { email?: string, income?: { totalIncome?: number }  };

                setUserData((prev) => ({
                    ...prev,
                    uid: uid,
                    email: data.email || ""
                }));

                setUserIncomeData((prev) => ({
                    ...prev,
                    monthlyIncome: data.income?.totalIncome || 0,
                }));

            } catch (e) {
                setError("Error occured: " + e);
            }
        };

        fetchUserEmail();

    }, []);

    

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
                    <p className={styles.cardSubtitle}>Out of R {userIncomeData.monthlyIncome} income</p>
                    
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                            type="number" 
                            className={styles.amountInput} 
                            onChange={(e) => setUserIncomeData((prev) => ({
                                ...prev,
                                monthlyLimit: e.target.valueAsNumber,
                                weeklyLimit: e.target.valueAsNumber / 4,
                            }))}
                            placeholder="0" 
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
                            type="number" 
                            className={`${styles.amountInput} ${styles.highlightedInput}`} 
                            value={userIncomeData.weeklyLimit || "0"}
                            placeholder="0" 
                            disabled
                        />
                    </div>
                    </div>
                </div>

                <div className={styles.splitSection}>
                    <div className={styles.splitHeader}>
                    <h3 className={styles.splitTitle}>Split the R {userIncomeData.monthlyIncome} between your categories</h3>
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

                {error && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => updateUserData()}>
                        {loading ? (
                            <LoaderCircle size={16} className={`loaderCircle`}/>
                        )
                        :
                        (
                            <>Finish setup</>
                        )}
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => navigate("/income")}>
                        Back
                    </button>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Budget;