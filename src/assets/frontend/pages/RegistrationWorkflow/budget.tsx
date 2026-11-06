import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { db, auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Budget.module.css";
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';
import { safeNum, formatRand } from '../../utils/safeguards';

const RECOMMENDED_SPLIT = {
    rent: 0.34,
    food: 0.26,
    transport: 0.17,
    dataAndAirtime: 0.12,
    groceries: 0.00, // Left at 0 to keep the math balanced with the previous report
    other: 0.11
};

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

    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const monthlyLimitVal = safeNum(userIncomeData.monthlyLimit);
    const recommendedAllocations = {
        transport: Math.round(monthlyLimitVal * RECOMMENDED_SPLIT.transport),
        food: Math.round(monthlyLimitVal * RECOMMENDED_SPLIT.food),
        rent: Math.round(monthlyLimitVal * RECOMMENDED_SPLIT.rent),
        dataAndAirtime: Math.round(monthlyLimitVal * RECOMMENDED_SPLIT.dataAndAirtime),
        groceries: Math.round(monthlyLimitVal * RECOMMENDED_SPLIT.groceries),
        other: Math.round(monthlyLimitVal * RECOMMENDED_SPLIT.other),
    };
    const totalAllocated = Object.values(recommendedAllocations).reduce((sum, val) => sum + val, 0);
    const remainingToAllocate = Math.max(0, monthlyLimitVal - totalAllocated);

    const categories = [
        { name: 'Transport', amount: formatRand(recommendedAllocations.transport, 0), percentage: monthlyLimitVal > 0 ? Math.round(RECOMMENDED_SPLIT.transport * 100) : 0 },
        { name: 'Food', amount: formatRand(recommendedAllocations.food, 0), percentage: monthlyLimitVal > 0 ? Math.round(RECOMMENDED_SPLIT.food * 100) : 0 },
        { name: 'Rent', amount: formatRand(recommendedAllocations.rent, 0), percentage: monthlyLimitVal > 0 ? Math.round(RECOMMENDED_SPLIT.rent * 100) : 0 },
        { name: 'Data and airtime', amount: formatRand(recommendedAllocations.dataAndAirtime, 0), percentage: monthlyLimitVal > 0 ? Math.round(RECOMMENDED_SPLIT.dataAndAirtime * 100) : 0 },
        { name: 'Groceries', amount: formatRand(recommendedAllocations.groceries, 0), percentage: monthlyLimitVal > 0 ? Math.round(RECOMMENDED_SPLIT.groceries * 100) : 0 },
        { name: 'Other', amount: formatRand(recommendedAllocations.other, 0), percentage: monthlyLimitVal > 0 ? Math.round(RECOMMENDED_SPLIT.other * 100) : 0 },
    ];

    const updateUserData = async () => {

        try {
        
            setLoading(true);

            const mLimit = safeNum(userIncomeData.monthlyLimit);
            const wLimit = safeNum(userIncomeData.weeklyLimit);

            const ref = doc(db, "users", userData.uid);

            await updateDoc(ref, {
                limit: {
                    monthlyLimit: mLimit,
                    weeklyLimit: wLimit,
                },
                limits: {
                    monthlyLimit: mLimit,
                    weeklyLimit: wLimit,
                }
            });

            // Initialize default budget_planner document so user can immediately record expenses
            const budgetRef = doc(db, "budget_planner", userData.uid);
            await setDoc(budgetRef, {
                monthlyLimit: mLimit,
                weeklyLimit: wLimit,
                transport: Math.round(mLimit * RECOMMENDED_SPLIT.transport),
                food: Math.round(mLimit * RECOMMENDED_SPLIT.food),
                rent: Math.round(mLimit * RECOMMENDED_SPLIT.rent),
                dataAndAirtime: Math.round(mLimit * RECOMMENDED_SPLIT.dataAndAirtime),
                groceries: Math.round(mLimit * RECOMMENDED_SPLIT.groceries),
                other: Math.round(mLimit * RECOMMENDED_SPLIT.other),
                spentTotals: {
                    transport: 0,
                    food: 0,
                    rent: 0,
                    dataAndAirtime: 0,
                    groceries: 0,
                    other: 0,
                }
            }, { merge: true });

            const criticalData = { 
                monthlyIncome: safeNum(userIncomeData.monthlyIncome),
                monthlyLimit: mLimit,
                weeklyLimit: wLimit,
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
                const ref = doc(db, "users", uid);
                const snapshot = await getDoc(ref);

                if (!snapshot.exists()) {
                    console.error("Error occured: No database document found");
                    setError("Error occured: No database document found");
                    return;
                }

                const data = snapshot.data() as { email?: string, income?: { totalIncome?: number }  };

                setUserData((prev) => ({
                    ...prev,
                    uid: uid,
                    email: data.email || "",
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
                <p className={styles.subtitle}>(You can adjust the budget after onboarding)</p>

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
                            onChange={(e) => {
                                const val = safeNum(e.target.valueAsNumber, 0);
                                setUserIncomeData((prev) => ({
                                    ...prev,
                                    monthlyLimit: val,
                                    weeklyLimit: val / 4,
                                }));
                            }}
                            placeholder="0"
                            max={userIncomeData.monthlyIncome} 
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
                    <h3 className={styles.splitTitle}>Recommended split for your {formatRand(monthlyLimitVal, 0)} monthly limit</h3>
                    <span className={styles.remainingText}>{formatRand(remainingToAllocate, 0)} left to allocate</span>
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