import React, { useEffect, useState } from 'react';
import styles from "../styles/Reports.module.css";
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: any; // Firestore Timestamp
  description: string;
  userId: string;
};

type WeeklySpending = {
  week: string;
  amount: number;
  isOverLimit: boolean;
};

type CategoryBreakdown = {
  name: string;
  amount: number;
  percentage: number;
};

const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const CATEGORY_ORDER = ['Rent', 'Food', 'Transport', 'Data and airtime', 'Groceries', 'Other'];

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [weeklySpending, setWeeklySpending] = useState<WeeklySpending[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [weeklyLimit, setWeeklyLimit] = useState(0);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchReportData = async () => {
    try {
      setLoading(true);

      const uid = getAuth().currentUser?.uid;
      if (!uid) return;

      // Fetch user income and budget settings
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const monthlyIncome = userData?.income?.totalIncome || 0;
      const monthlyLimit = userData?.limit?.monthlyLimit || 0;
      const calculatedWeeklyLimit = monthlyLimit > 0 ? monthlyLimit / 4 : 0;

      setTotalIncome(monthlyIncome);
      setWeeklyLimit(calculatedWeeklyLimit);

      // Fetch all expenses for this user
      const expensesRef = collection(db, "expenses");
      const expensesQuery = query(expensesRef, where("userId", "==", uid));
      const expensesSnap = await getDocs(expensesQuery);

      const expenses: Expense[] = expensesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];

      // Calculate total spent
      const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      setTotalSpent(total);
      setNetBalance(monthlyIncome - total);

      // Calculate date range for current month
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      setDateRange({
        from: monthStart.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
        to: monthEnd.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
      });

      // Filter expenses for current month
      const currentMonthExpenses = expenses.filter(e => {
        const expenseDate = e.date?.toDate ? e.date.toDate() : new Date(e.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });

      // Calculate weekly spending (4 weeks of current month)
      const weeklyData: WeeklySpending[] = WEEK_LABELS.map((weekLabel, index) => {
        const weekStart = new Date(monthStart);
        weekStart.setDate(monthStart.getDate() + index * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const weekExpenses = currentMonthExpenses.filter(e => {
          const expenseDate = e.date?.toDate ? e.date.toDate() : new Date(e.date);
          return expenseDate >= weekStart && expenseDate <= weekEnd;
        });

        const weekTotal = weekExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

        return {
          week: weekLabel,
          amount: weekTotal,
          isOverLimit: calculatedWeeklyLimit > 0 && weekTotal > calculatedWeeklyLimit
        };
      });

      setWeeklySpending(weeklyData);

      // Calculate category breakdown from current month expenses
      const categoryTotals: Record<string, number> = {};

      currentMonthExpenses.forEach(e => {
        // Normalize category names to match our display names
        let normalizedCategory = e.category;
        if (e.category.toLowerCase() === "data" || e.category.toLowerCase() === "dataandairtime" || e.category.toLowerCase() === "data and airtime") {
          normalizedCategory = "Data and airtime";
        } else if (e.category.toLowerCase() === "education") {
          normalizedCategory = "Other";
        }

        categoryTotals[normalizedCategory] = (categoryTotals[normalizedCategory] || 0) + (e.amount || 0);
      });

      // Build category breakdown in our preferred order
      const breakdown: CategoryBreakdown[] = CATEGORY_ORDER.map(name => {
        const amount = categoryTotals[name] || 0;
        return {
          name,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0
        };
      }).filter(cat => cat.amount > 0 || CATEGORY_ORDER.includes(cat.name)); // Show all categories even if 0

      setCategoryBreakdown(breakdown);

    } catch (e) {
      console.log("Error fetching report data: " + e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount).replace('ZAR', 'R').trim();
  };

  const formatCurrencyShort = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('ZAR', 'R').trim();
  };

  // Find max weekly amount for chart scaling
  const maxWeeklyAmount = weeklySpending.length > 0
    ? Math.max(...weeklySpending.map(w => w.amount), weeklyLimit || 1)
    : 1;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Reports and summary</h1>

        <div className={styles.controls}>
          <div className={styles.datePicker}>
            <span className={styles.dateLabel}>From</span>
            <span className={styles.dateValue}>
              {dateRange.from ? dateRange.from.split(' ').join('<br/>') : 'Loading...'}
            </span>
          </div>
          <div className={styles.datePicker}>
            <span className={styles.dateLabel}>To</span>
            <span className={styles.dateValue}>
              {dateRange.to ? dateRange.to.split(' ').join('<br/>') : 'Loading...'}
            </span>
          </div>
          <button className={styles.exportBtn} disabled={loading}>
            {loading ? 'Loading...' : 'Export<br/>report'}
          </button>
        </div>
      </header>

      {/* Top Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Total income</span>
          <div className={styles.cardValue}>{formatCurrency(totalIncome)}</div>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Total spent</span>
          <div className={styles.cardValue}>{formatCurrency(totalSpent)}</div>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Net balance</span>
          <div className={`${styles.cardValue} ${netBalance >= 0 ? styles.textGreen : styles.textRed}`}>
            {formatCurrency(netBalance)}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>

        {/* Left Column: Bar Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Spending by week</h2>

          <div className={styles.chartContainer}>
            {weeklySpending.map((week, index) => {
              const heightPercent = maxWeeklyAmount > 0 ? (week.amount / maxWeeklyAmount) * 100 : 0;
              return (
                <div key={index} className={styles.barGroup}>
                  <span className={styles.barAmount}>{formatCurrencyShort(week.amount)}</span>
                  <div
                    className={`${styles.bar} ${week.isOverLimit ? styles.barAmber : styles.barBlue}`}
                    style={{ height: `${Math.max(heightPercent, 2)}%` }} // Min 2% height for visibility
                  ></div>
                  <span className={styles.barLabel}>{week.week}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.chartFooter}>
            {weeklyLimit > 0
              ? `Amber marks weeks exceeding the ${formatCurrencyShort(weeklyLimit)} weekly limit`
              : 'Set a monthly limit to see weekly limit indicators'
            }
          </div>
        </div>

        {/* Right Column: Category Breakdown */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Share by category</h2>

          {loading ? (
            <div className={styles.categoryList}>
              {[1,2,3,4,5].map((_, i) => (
                <div key={i} className={styles.categoryRow}>
                  <span className={styles.categoryName}>Loading...</span>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarBg}>
                      <div className={`${styles.progressBarFill} ${styles.loading}`} style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <span className={styles.categoryPercent}>--%</span>
                </div>
              ))}
            </div>
          ) : categoryBreakdown.length > 0 ? (
            <div className={styles.categoryList}>
              {categoryBreakdown.map((cat, index) => (
                <div key={index} className={styles.categoryRow}>
                  <span className={styles.categoryName}>{cat.name}</span>

                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <span className={styles.categoryPercent}>{cat.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No expenses recorded for this month</p>
              <p className={styles.emptySubtext}>Add expenses to see your category breakdown</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reports;