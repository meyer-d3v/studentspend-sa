import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/SidebarStyles/MainSidebar.module.css";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { getAuth } from "firebase/auth";
import { safeNum, safePercent, safeDate } from "../utils/safeguards";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainSidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    balanceLeft: 0,
    totalIncome: 0,
    totalSpent: 0,
    spentPercentage: 0,
  });

  const navigateToPage = (path: string) => {
    setActiveTab(path);
    navigate("/" + path);
  };

  // Sync active tab with current URL route
  useEffect(() => {
    const current = location.pathname.replace(/^\//, "").split("/")[0] || "dashboard";
    setActiveTab(current);
  }, [location.pathname]);

  const fetchUserFinancials = async () => {
    try {
      const uid = getAuth().currentUser?.uid || "";
      if (!uid) {
        console.log("No user is logged in");
        return;
      }

      // 1. Fetch user document to get profile and total income
      const userRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        console.error("No user database document found");
        return;
      }

      const userData = userSnapshot.data() as any;

      const incomeObj = userData?.income;
      const calculatedIncome = safeNum(incomeObj?.nsfasAllowance) + safeNum(incomeObj?.partTimeWork) + safeNum(incomeObj?.familySupport);
      const totalIncome = safeNum(incomeObj?.totalIncome, calculatedIncome);

      const firstName = (userData?.firstName || userData?.firstname || "").trim();

      // 2. Fetch all expenses for this user to calculate current month total
      const expensesRef = collection(db, "expenses");
      const expensesQuery = query(expensesRef, where("userId", "==", uid));
      const expensesSnapshot = await getDocs(expensesQuery);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      let currentMonthSpent = 0;

      expensesSnapshot.docs.forEach((docSnap) => {
        const exp = docSnap.data();
        const expenseDate = safeDate(exp.date || exp.createdAt);

        if (
          expenseDate.getFullYear() === currentYear &&
          expenseDate.getMonth() === currentMonth
        ) {
          currentMonthSpent += safeNum(exp.amount, 0);
        }
      });

      // 3. Calculate balance left and spent percentage
      const balanceLeft = totalIncome - currentMonthSpent;
      const spentPercentage = safePercent(currentMonthSpent, totalIncome);

      setUserDetails({
        firstname: firstName,
        totalIncome: totalIncome,
        totalSpent: currentMonthSpent,
        balanceLeft: balanceLeft,
        spentPercentage: spentPercentage,
      });

    } catch (e) {
      console.log("Error occurred fetching user balance. Error: " + e);
    }
  };

  // Re-fetch on mount and whenever the user navigates (e.g. after adding an expense)
  useEffect(() => {
    fetchUserFinancials();
  }, [location.pathname]);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.headerSection}>
        <p className={styles.greeting}>
          Welcome{userDetails.firstname ? `, ${userDetails.firstname}` : ""}
        </p>

        <div className={styles.balanceSection}>
          <p className={styles.balanceLabel}>BALANCE LEFT</p>
          <h2 className={styles.balanceAmount}>
            {userDetails.balanceLeft < 0 ? (
              <span style={{ color: "#c0392b" }}>
                -R {Math.abs(userDetails.balanceLeft).toLocaleString("en-ZA", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            ) : (
              `R ${userDetails.balanceLeft.toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </h2>

          <div className={styles.progressBarContainer}>
            <div
              className={`${styles.progressBarFill} ${
                userDetails.spentPercentage > 100 ? styles.progressBarOver : ""
              }`}
              style={{
                width: `${Math.min(Math.max(userDetails.spentPercentage || 0, 0), 100).toFixed(2)}%`,
              }}
            ></div>
          </div>

          <p className={styles.progressText}>
            {userDetails.totalIncome > 0
              ? `${Math.min(Math.max(userDetails.spentPercentage || 0, 0), 100).toFixed(1)}% of your monthly income used`
              : "Set your income in Account to track usage"}
          </p>
        </div>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.active : ""}`}
            onClick={() => navigateToPage("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={`${styles.navItem} ${activeTab === "addExpenses" ? styles.active : ""}`}
            onClick={() => navigateToPage("addExpenses")}
          >
            Add expense
          </li>

          <li
            className={`${styles.navItem} ${activeTab === "expenses" ? styles.active : ""}`}
            onClick={() => navigateToPage("expenses")}
          >
            Expenses
          </li>

          <li
            className={`${styles.navItem} ${activeTab === "budgetPlanner" ? styles.active : ""}`}
            onClick={() => navigateToPage("budgetPlanner")}
          >
            Budget planner
          </li>

          <li
            className={`${styles.navItem} ${activeTab === "financialTips" ? styles.active : ""}`}
            onClick={() => navigateToPage("financialTips")}
          >
            Financial tips
          </li>

          <li
            className={`${styles.navItem} ${activeTab === "alerts" ? styles.active : ""}`}
            onClick={() => navigateToPage("alerts")}
          >
            Alerts
          </li>

          <li
            className={`${styles.navItem} ${activeTab === "reports" ? styles.active : ""}`}
            onClick={() => navigateToPage("reports")}
          >
            Reports
          </li>

          <li
            className={`${styles.navItem} ${activeTab === "settings" ? styles.active : ""}`}
            onClick={() => navigateToPage("settings")}
          >
            Account
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainSidebar;
