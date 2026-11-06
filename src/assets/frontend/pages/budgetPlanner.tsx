import React, { useEffect, useState } from 'react';
import styles from "../styles/BudgetPlanner.module.css";
import { getAuth } from 'firebase/auth';
import { getDoc, doc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { LoaderCircle } from 'lucide-react';
import { safeNum, safePercent, migrateBudgetPlannerGroceries } from '../utils/safeguards';

type CategoryKey = "transport" | "food" | "rent" | "dataAndAirtime" | "entertainment" | "other";

const CATEGORIES: { key: CategoryKey; name: string }[] = [
  { key: "transport", name: "Transport" },
  { key: "food", name: "Food" },
  { key: "rent", name: "Rent" },
  { key: "dataAndAirtime", name: "Data and airtime" },
  { key: "entertainment", name: "Entertainment" },
  { key: "other", name: "Other" },
];

const BudgetPlanner: React.FC = () => {
  const [userData, setUserData] = useState({
    monthlyIncome: 0,
    monthlyLimit: 0,
    weeklyLimit: 0,
    catagoryAllocations: {
      transport: 0,
      food: 0,
      rent: 0,
      dataAndAirtime: 0,
      entertainment: 0,
      other: 0,
    },
  });

  const [activeToggle, setActiveToggle] = useState<string>("weekly");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  const loadUserData = async () => {
    try {
      setFetching(true);
      const uid = getAuth().currentUser?.uid || "";
      if (!uid) {
        console.log("No user logged in");
        // Set safe defaults when no user
        setUserData({
          monthlyIncome: 0,
          monthlyLimit: 0,
          weeklyLimit: 0,
          catagoryAllocations: {
            transport: 0,
            food: 0,
            rent: 0,
            dataAndAirtime: 0,
            entertainment: 0,
            other: 0,
          },
        });
        return;
      }

      // 1. Fetch user information (income & limits)
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.exists() ? userSnap.data() : null;

      const incomeObj = userDoc?.income;
      // Safely parse income values with fallback to 0
      const nsfasAllowance = safeNum(incomeObj?.nsfasAllowance);
      const partTimeWork = safeNum(incomeObj?.partTimeWork);
      const familySupport = safeNum(incomeObj?.familySupport);
      const totalIncome = safeNum(incomeObj?.totalIncome, nsfasAllowance + partTimeWork + familySupport);

      let monthlyLimit =
        safeNum(userDoc?.limit?.monthlyLimit) ||
        safeNum(userDoc?.limits?.monthlyLimit) ||
        0;

      // 2. Fetch category budget allocations (and migrate legacy groceries -> entertainment)
      const budgetRef = doc(db, "budget_planner", uid);
      const budgetSnap = await getDoc(budgetRef);
      const rawBudgetData = budgetSnap.exists() ? budgetSnap.data() : null;
      const budgetData = await migrateBudgetPlannerGroceries(budgetRef, rawBudgetData);

      const allocations = {
        transport: safeNum(budgetData?.transport),
        food: safeNum(budgetData?.food),
        rent: safeNum(budgetData?.rent),
        dataAndAirtime: safeNum(budgetData?.dataAndAirtime),
        entertainment: safeNum(budgetData?.entertainment),
        other: safeNum(budgetData?.other),
      };

      if (!monthlyLimit && budgetData?.monthlyLimit) {
        monthlyLimit = safeNum(budgetData.monthlyLimit);
      }

      // If monthlyLimit still 0 but user has saved allocations, sum them up
      const totalAllocated =
        allocations.transport +
        allocations.food +
        allocations.rent +
        allocations.dataAndAirtime +
        allocations.entertainment +
        allocations.other;

      if (monthlyLimit === 0 && totalAllocated > 0) {
        monthlyLimit = totalAllocated;
      }

      // Ensure weeklyLimit is finite and safe
      const weeklyLimit = monthlyLimit > 0 && isFinite(monthlyLimit) ? monthlyLimit / 4 : 0;

      setUserData({
        monthlyIncome: isFinite(totalIncome) ? totalIncome : 0,
        monthlyLimit: isFinite(monthlyLimit) ? monthlyLimit : 0,
        weeklyLimit: isFinite(weeklyLimit) ? weeklyLimit : 0,
        catagoryAllocations: allocations,
      });
    } catch (e) {
      console.log("Error loading budget data: " + e);
      // On error, set safe defaults
      setUserData({
        monthlyIncome: 0,
        monthlyLimit: 0,
        weeklyLimit: 0,
        catagoryAllocations: {
          transport: 0,
          food: 0,
          rent: 0,
          dataAndAirtime: 0,
          entertainment: 0,
          other: 0,
        },
      });
    } finally {
      setFetching(false);
    }
  };

  const saveBudget = async () => {
    try {
      setLoading(true);
      const uid = getAuth().currentUser?.uid || "";
      if (!uid) return;

      const weeklyLimit = userData.monthlyLimit > 0 ? userData.monthlyLimit / 4 : 0;

      // 1. Save allocations and limits to budget_planner with merge to protect spentTotals
      const budgetRef = doc(db, "budget_planner", uid);
      await setDoc(
        budgetRef,
        {
          monthlyLimit: userData.monthlyLimit,
          weeklyLimit: weeklyLimit,
          transport: userData.catagoryAllocations.transport || 0,
          food: userData.catagoryAllocations.food || 0,
          rent: userData.catagoryAllocations.rent || 0,
          dataAndAirtime: userData.catagoryAllocations.dataAndAirtime || 0,
          entertainment: userData.catagoryAllocations.entertainment || 0,
          other: userData.catagoryAllocations.other || 0,
          groceries: deleteField(),
          "spentTotals.groceries": deleteField(),
        },
        { merge: true }
      );

      // 2. Keep users document limits in sync
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        "limit.monthlyLimit": userData.monthlyLimit,
        "limit.weeklyLimit": weeklyLimit,
        "limits.monthlyLimit": userData.monthlyLimit,
        "limits.weeklyLimit": weeklyLimit,
      });

      alert("Budget saved successfully!");
    } catch (e) {
      alert("Error occurred saving budget: " + e);
    } finally {
      setLoading(false);
    }
  };

  const resetBudget = async () => {
    await loadUserData();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Calculate total allocated and remaining amount to allocate
  const totalAllocated =
    userData.catagoryAllocations.transport +
    userData.catagoryAllocations.food +
    userData.catagoryAllocations.rent +
    userData.catagoryAllocations.dataAndAirtime +
    userData.catagoryAllocations.entertainment +
    userData.catagoryAllocations.other;

  const remainingToAllocate = userData.monthlyLimit - totalAllocated;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Budget planner</h1>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${activeToggle === "monthly" ? styles.activeToggle : ""}`}
            onClick={() => setActiveToggle("monthly")}
          >
            Monthly
          </button>

          <button
            className={`${styles.toggleBtn} ${activeToggle === "weekly" ? styles.activeToggle : ""}`}
            onClick={() => setActiveToggle("weekly")}
          >
            Weekly
          </button>
        </div>
      </header>

      {/* Top Summary Cards */}
      <div className={styles.summaryGrid}>
        {/* Monthly Income Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Monthly income</span>
          <div className={styles.cardValueLarge}>
            R {userData.monthlyIncome.toLocaleString("en-ZA")}
          </div>
        </div>

        {/* Total Budget Card */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>
            Total budget{" "}
            {userData.monthlyLimit === 0 &&
              "(Please set a monthly limit before assigning categories)"}
          </span>
          <div className={styles.inputGroupLarge}>
            <span className={styles.currencyPrefix}>R</span>
            <input
              type="number"
              className={styles.amountInput}
              value={userData.monthlyLimit === 0 ? "" : userData.monthlyLimit}
              placeholder="0"
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                const newValue = isNaN(val) ? 0 : Math.max(0, val);

                if (userData.monthlyIncome > 0 && newValue > userData.monthlyIncome) {
                  alert("Budget cannot be more than income.");
                  return;
                }

                setUserData((prev) => ({
                  ...prev,
                  monthlyLimit: newValue,
                  weeklyLimit: newValue / 4,
                }));
              }}
            />
          </div>
        </div>

        {/* Weekly Limit Card */}
        {activeToggle === "monthly" ? (
          <div className={styles.card}>
            <span className={styles.cardLabel}>Monthly limit, calculated</span>
            <div className={`${styles.cardValueLarge} ${styles.textBlue}`}>
              R {userData.monthlyLimit.toLocaleString("en-ZA")}
            </div>
          </div>
        ) : (
          <div className={styles.card}>
            <span className={styles.cardLabel}>Weekly limit, calculated</span>
            <div className={`${styles.cardValueLarge} ${styles.textBlue}`}>
              R {Math.round(userData.monthlyLimit > 0 ? userData.monthlyLimit / 4 : userData.monthlyIncome / 4).toLocaleString("en-ZA")}
            </div>
          </div>
        )}
      </div>

      {/* Main Panel: Category Allocations */}
      <div className={styles.mainPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Category allocations</h2>
          <span className={remainingToAllocate >= 0 ? styles.textGreen : styles.cardLabel} style={{ color: remainingToAllocate < 0 ? "#c0392b" : undefined }}>
            {remainingToAllocate >= 0
              ? `R ${remainingToAllocate.toLocaleString("en-ZA")} left to allocate`
              : `Budget exceeded by R ${Math.abs(remainingToAllocate).toLocaleString("en-ZA")}`}
          </span>
        </div>

        {fetching ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <LoaderCircle size={24} className="loaderCircle" />
          </div>
        ) : (
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const allocation = safeNum(userData.catagoryAllocations[cat.key], 0);
              const percentNum = safePercent(allocation, userData.monthlyLimit);
              const displayPercent = percentNum > 0 ? percentNum.toFixed(1) : "0";
              const progressWidth = percentNum;

              return (
                <div key={cat.key} className={styles.categoryItem}>
                  <div className={styles.categoryLeft}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryName}>{cat.name}</span>
                      <span className={styles.categoryPercent}>
                        {displayPercent}% of budget
                      </span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${progressWidth.toFixed(1)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.categoryRight}>
                    <div className={styles.inputGroupSmall}>
                      <span className={styles.currencyPrefix}>R</span>
                      <input
                        type="number"
                        className={styles.amountInput}
                        value={allocation === 0 ? "" : allocation}
                        placeholder="0"
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                          const newValue = isNaN(val) ? 0 : Math.max(0, val);

                          setUserData((prev) => ({
                            ...prev,
                            catagoryAllocations: {
                              ...prev.catagoryAllocations,
                              [cat.key]: newValue,
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.primaryBtn}
            onClick={saveBudget}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle size={16} className="loaderCircle" />
            ) : (
              "Save budget"
            )}
          </button>
          <button className={styles.secondaryBtn} onClick={resetBudget} disabled={loading}>
            Reset to last saved
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
