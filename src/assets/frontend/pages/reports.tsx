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
  date: any; // Firestore Timestamp or ISO string
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

/**
 * Canonical display names keyed by the lowercase-no-spaces Firestore category value.
 * Any value not in this map falls through to "Other".
 */
const CATEGORY_KEY_MAP: Record<string, string> = {
  food:           'Food',
  transport:      'Transport',
  rent:           'Rent',
  dataandairtime: 'Data and airtime',
  data:           'Data and airtime',  // alias
  groceries:      'Groceries',
  education:      'Other',            // alias
  other:          'Other',
};

/** Preferred display order for the sidebar */
const CATEGORY_ORDER = ['Rent', 'Food', 'Transport', 'Data and airtime', 'Groceries', 'Other'];

/** Normalise a raw Firestore category string to a canonical display name. */
const normaliseCategory = (raw: string): string => {
  const key = raw.toLowerCase().replace(/[\s&]+/g, '');
  return CATEGORY_KEY_MAP[key] ?? 'Other';
};

const Reports: React.FC = () => {
  const [loading, setLoading]                       = useState(true);
  const [totalIncome, setTotalIncome]               = useState(0);
  const [totalSpent, setTotalSpent]                 = useState(0);
  const [netBalance, setNetBalance]                 = useState(0);
  const [weeklySpending, setWeeklySpending]         = useState<WeeklySpending[]>([]);
  const [categoryBreakdown, setCategoryBreakdown]   = useState<CategoryBreakdown[]>([]);
  const [weeklyLimit, setWeeklyLimit]               = useState(0);
  const [dateRange, setDateRange]                   = useState({ from: '', to: '' });

  const fetchReportData = async () => {
    try {
      setLoading(true);

      const uid = getAuth().currentUser?.uid;
      if (!uid) return;

      // ── 1. User income & budget settings ──────────────────────────────────
      const userSnap = await getDoc(doc(db, 'users', uid));
      const userData = userSnap.data();

      const monthlyIncome        = userData?.income?.totalIncome  || 0;
      const monthlyLimit         = userData?.limit?.monthlyLimit  || 0;
      const calculatedWeeklyLimit = monthlyLimit > 0 ? monthlyLimit / 4 : 0;

      setTotalIncome(monthlyIncome);
      setWeeklyLimit(calculatedWeeklyLimit);

      // ── 2. All expenses for this user ─────────────────────────────────────
      const expensesSnap = await getDocs(
        query(collection(db, 'expenses'), where('userId', '==', uid))
      );

      const expenses: Expense[] = expensesSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Expense[];

      // All-time total (for summary cards)
      const allTimeTotal = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      setTotalSpent(allTimeTotal);
      setNetBalance(monthlyIncome - allTimeTotal);

      // ── 3. Current-month date range ────────────────────────────────────────
      const now        = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      setDateRange({
        from: monthStart.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
        to:   monthEnd.toLocaleDateString(  'en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      });

      // ── 4. Filter to current month ─────────────────────────────────────────
      const currentMonthExpenses = expenses.filter(e => {
        const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
        return d >= monthStart && d <= monthEnd;
      });

      const currentMonthTotal = currentMonthExpenses.reduce(
        (sum, e) => sum + (e.amount || 0), 0
      );

      // ── 5. Weekly spending bars ────────────────────────────────────────────
      const weeklyData: WeeklySpending[] = WEEK_LABELS.map((weekLabel, index) => {
        const weekStart = new Date(monthStart);
        weekStart.setDate(monthStart.getDate() + index * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59);

        const weekTotal = currentMonthExpenses
          .filter(e => {
            const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
            return d >= weekStart && d <= weekEnd;
          })
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        return {
          week:        weekLabel,
          amount:      weekTotal,
          isOverLimit: calculatedWeeklyLimit > 0 && weekTotal > calculatedWeeklyLimit,
        };
      });

      setWeeklySpending(weeklyData);

      // ── 6. Category breakdown (current month only) ────────────────────────
      //
      // Build a totals map keyed by canonical display name.
      const categoryTotals: Record<string, number> = {};

      currentMonthExpenses.forEach(e => {
        const label = normaliseCategory(e.category ?? '');
        categoryTotals[label] = (categoryTotals[label] || 0) + (e.amount || 0);
      });

      // Build ordered list; use currentMonthTotal as the denominator so
      // percentages always add up to 100 % for the displayed month.
      const breakdown: CategoryBreakdown[] = CATEGORY_ORDER
        .map(name => ({
          name,
          amount:     categoryTotals[name] || 0,
          percentage: currentMonthTotal > 0
            ? ((categoryTotals[name] || 0) / currentMonthTotal) * 100
            : 0,
        }))
        .filter(cat => cat.amount > 0); // Only show categories with actual spend

      setCategoryBreakdown(breakdown);

    } catch (e) {
      console.log('Error fetching report data: ' + e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatCurrency = (amount: number) =>
    `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatCurrencyShort = (amount: number) =>
    `R ${Math.round(amount).toLocaleString('en-ZA')}`;

  // Chart scaling: tallest bar OR the weekly limit line, whichever is higher
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
              {dateRange.from || 'Loading...'}
            </span>
          </div>
          <div className={styles.datePicker}>
            <span className={styles.dateLabel}>To</span>
            <span className={styles.dateValue}>
              {dateRange.to || 'Loading...'}
            </span>
          </div>
          <button className={styles.exportBtn} disabled={loading}>
            {loading ? 'Loading...' : 'Export report'}
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

        {/* Left Column: Weekly bar chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Spending by week</h2>

          <div className={styles.chartContainer}>
            {weeklySpending.map((week, index) => {
              const heightPercent = maxWeeklyAmount > 0
                ? (week.amount / maxWeeklyAmount) * 100
                : 0;
              return (
                <div key={index} className={styles.barGroup}>
                  <span className={styles.barAmount}>{formatCurrencyShort(week.amount)}</span>
                  <div
                    className={`${styles.bar} ${week.isOverLimit ? styles.barAmber : styles.barBlue}`}
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  ></div>
                  <span className={styles.barLabel}>{week.week}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.chartFooter}>
            {weeklyLimit > 0
              ? `Amber marks weeks exceeding the ${formatCurrencyShort(weeklyLimit)} weekly limit`
              : 'Set a monthly limit to see weekly limit indicators'}
          </div>
        </div>

        {/* Right Column: Share by category */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Share by category</h2>

          {loading ? (
            <div className={styles.categoryList}>
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className={styles.categoryRow}>
                  <span className={styles.categoryName}>Loading...</span>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarBg}>
                      <div
                        className={`${styles.progressBarFill} ${styles.loading}`}
                        style={{ width: '50%' }}
                      ></div>
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

                  <span className={styles.categoryPercent}>
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}

              {/* Totals row */}
              <div className={styles.categoryRow} style={{ marginTop: '0.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                <span className={styles.categoryName} style={{ fontWeight: 600 }}>Total this month</span>
                <div className={styles.progressBarWrapper}></div>
                <span className={styles.categoryPercent} style={{ fontWeight: 600 }}>
                  {formatCurrency(categoryBreakdown.reduce((s, c) => s + c.amount, 0))}
                </span>
              </div>
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
