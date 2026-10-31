import React, { useEffect, useState, useMemo } from 'react';
import styles from "../styles/Expenses.module.css";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDocs, query, where, collection, deleteDoc, doc } from 'firebase/firestore';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { Trash2 } from 'lucide-react';

type Expense = {
  id: string;
  date: any;
  description: string;
  category: string;
  amount: number;
};

type CategorySummary = {
  name: string;
  amount: string;
  percentage: string;
};

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
  'All categories',
  'Food',
  'Transport',
  'Rent',
  'Data and airtime',
  'Groceries',
  'Other',
];

/** Build the last 13 months (current + 12 previous) as { label, year, month } */
const buildMonthOptions = () => {
  const options: { label: string; year: number; month: number }[] = [
    { label: 'All months', year: -1, month: -1 },
  ];
  const now = new Date();
  for (let i = 0; i < 13; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      label: d.toLocaleString('en-ZA', { month: 'long', year: 'numeric' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return options;
};

const MONTH_OPTIONS = buildMonthOptions();

/** Normalise a raw Firestore category to a canonical display label. */
const normaliseCategory = (raw: string): string => {
  const key = (raw ?? '').toLowerCase().replace(/[\s&]+/g, '');
  const map: Record<string, string> = {
    food:           'Food',
    transport:      'Transport',
    rent:           'Rent',
    dataandairtime: 'Data and airtime',
    data:           'Data and airtime',
    groceries:      'Groceries',
    education:      'Other',
    other:          'Other',
  };
  return map[key] ?? 'Other';
};

// ── Component ──────────────────────────────────────────────────────────────
const Expenses: React.FC = () => {

  const [userExpenses, setUserExpenses]           = useState<Expense[]>([]);
  const [categoryExpensesData, setCategoryExpensesData] = useState<CategorySummary[]>([]);
  const [totalAmountForExpenses, setTotalAmountForExpense] = useState<number>(0);
  const [loading, setLoading]                     = useState<boolean>(false);
  const [error, setError]                         = useState<string | null>(null);

  // ── Filter state ───────────────────────────────────────────────────────
  const [search, setSearch]                       = useState<string>('');

  // "Pending" values — what the user has selected in the dropdowns but not applied yet
  const [pendingCategory, setPendingCategory]     = useState<string>('All categories');
  const [pendingMonth, setPendingMonth]           = useState<string>('All months');

  // "Applied" values — what was last confirmed via "Apply filters"
  const [appliedCategory, setAppliedCategory]     = useState<string>('All categories');
  const [appliedMonth, setAppliedMonth]           = useState<string>('All months');

  // True when applied filters differ from "show everything"
  const filtersActive =
    appliedCategory !== 'All categories' || appliedMonth !== 'All months';

  const navigate = useNavigate();

  const navigatePage = (path: string) => navigate('/' + path);

  // ── Data fetching ──────────────────────────────────────────────────────
  const buildCategoryData = (data: Expense[]): { categories: CategorySummary[]; total: number } => {

    let total = 0;
    const categoryMap: Record<string, { label: string; amount: number }> = {
      food:           { label: 'Food',            amount: 0 },
      transport:      { label: 'Transport',        amount: 0 },
      rent:           { label: 'Rent',             amount: 0 },
      dataandairtime: { label: 'Data and airtime', amount: 0 },
      groceries:      { label: 'Groceries',        amount: 0 },
      other:          { label: 'Other',            amount: 0 },
    };

    data.forEach((expense) => {
      total += expense.amount;
      const raw = (expense.category ?? 'other').toLowerCase().replace(/\s+/g, '');
      const key =
        raw === 'data' || raw === 'data&airtime' ? 'dataandairtime'
        : raw === 'education'                    ? 'other'
        : categoryMap[raw] !== undefined         ? raw
        : 'other';
      categoryMap[key].amount += expense.amount;
    });

    const categories: CategorySummary[] = Object.values(categoryMap).map((cat) => ({
      name:       cat.label,
      amount:     `R ${cat.amount.toFixed(2)}`,
      percentage: total > 0 ? `${((cat.amount / total) * 100).toFixed(1)}%` : '0%',
    }));

    return { categories, total };
  };

  const fetchUserExpenses = async () => {
    try {
      setLoading(true);
      const uid = getAuth().currentUser?.uid || '';
      const snapshot = await getDocs(
        query(collection(db, 'expenses'), where('userId', '==', uid))
      );

      if (snapshot.empty) {
        setUserExpenses([]);
        setCategoryExpensesData([]);
        setTotalAmountForExpense(0);
        return;
      }

      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Expense[];

      data.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setUserExpenses(data);

      const { categories, total } = buildCategoryData(data);
      setCategoryExpensesData(categories);
      setTotalAmountForExpense(total);

    } catch (e) {
      console.log('Error occured: ' + e);
      setError('Error occured: ' + e);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      fetchUserExpenses();
    } catch (e) {
      setError('Error occured trying to delete expense. Error: ' + e);
    }
  };

  useEffect(() => {
    fetchUserExpenses();
  }, []);

  // ── Filter handlers ────────────────────────────────────────────────────
  const applyFilters = () => {
    setAppliedCategory(pendingCategory);
    setAppliedMonth(pendingMonth);
  };

  const clearFilters = () => {
    setPendingCategory('All categories');
    setPendingMonth('All months');
    setAppliedCategory('All categories');
    setAppliedMonth('All months');
  };

  // ── Derived display list (memo so it only recalculates when deps change) ─
  const displayList = useMemo(() => {
    let list = [...userExpenses];

    // 1. Live search (description, category, date)
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((expense) => {
        const dateStr = expense.date?.toDate
          ? expense.date.toDate().toDateString()
          : new Date(expense.date).toDateString();
        return (
          (expense.description ?? '').toLowerCase().includes(s) ||
          (expense.category    ?? '').toLowerCase().includes(s) ||
          dateStr.toLowerCase().includes(s)
        );
      });
    }

    // 2. Applied category filter
    if (appliedCategory !== 'All categories') {
      list = list.filter(
        (expense) => normaliseCategory(expense.category) === appliedCategory
      );
    }

    // 3. Applied month filter
    if (appliedMonth !== 'All months') {
      const monthOption = MONTH_OPTIONS.find((m) => m.label === appliedMonth);
      if (monthOption) {
        list = list.filter((expense) => {
          const d = expense.date?.toDate
            ? expense.date.toDate()
            : new Date(expense.date);
          return d.getFullYear() === monthOption.year && d.getMonth() === monthOption.month;
        });
      }
    }

    return list;
  }, [userExpenses, search, appliedCategory, appliedMonth]);

  // ── Render ─────────────────────────────────────────────────────────────
  const emptyMessage =
    search.trim() || filtersActive
      ? 'No expenses match your filters.'
      : 'No expenses recorded yet.';

  return (
    <div className={styles.container}>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Expenses</h1>
        <button className={styles.primaryBtn} onClick={() => navigatePage('addExpenses')}>
          Add expense
        </button>
      </header>

      {error && (
        <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className={styles.filterBar}>

        {/* Live search */}
        <input
          type="text"
          placeholder="Search expenses"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category dropdown — pending, not applied yet */}
        <div className={styles.selectWrapper}>
          <select
            className={styles.selectInput}
            value={pendingCategory}
            onChange={(e) => setPendingCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Month dropdown — pending, not applied yet */}
        <div className={styles.selectWrapper}>
          <select
            className={styles.selectInput}
            value={pendingMonth}
            onChange={(e) => setPendingMonth(e.target.value)}
          >
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.label}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Apply / Clear button */}
        {filtersActive ? (
          <button
            className={`${styles.filterBtn} ${styles.filterBtnActive}`}
            onClick={clearFilters}
          >
            Clear filters
          </button>
        ) : (
          <button className={styles.filterBtn} onClick={applyFilters}>
            Apply filters
          </button>
        )}

      </div>

      {/* Active filter pills */}
      {filtersActive && (
        <div className={styles.activePills}>
          {appliedCategory !== 'All categories' && (
            <span className={styles.pill}>{appliedCategory}</span>
          )}
          {appliedMonth !== 'All months' && (
            <span className={styles.pill}>{appliedMonth}</span>
          )}
        </div>
      )}

      {/* Main Layout */}
      <div className={styles.layout}>

        {/* Left Column: Expenses Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className={styles.textRight}>Amount</th>
                  <th className={styles.textRight}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem' }}>
                      Loading expenses...
                    </td>
                  </tr>
                ) : displayList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#888' }}>
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  displayList.map((expense, index) => (
                    <tr key={expense.id ?? index}>
                      <td className={styles.textMuted}>
                        {expense.date?.toDate
                          ? expense.date.toDate().toLocaleDateString('en-ZA')
                          : new Date(expense.date).toLocaleDateString('en-ZA')}
                      </td>
                      <td className={styles.textMuted} style={{ textTransform: 'capitalize' }}>
                        {normaliseCategory(expense.category)}
                      </td>
                      <td className={styles.textDark}>{expense.description}</td>
                      <td className={`${styles.textRight} ${styles.textBold}`}>
                        R {Number(expense.amount).toFixed(2)}
                      </td>
                      <td className={styles.textRight}>
                        <button
                          className={styles.editLink}
                          onClick={() => deleteExpense(expense.id)}
                          title="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <span className={styles.textMuted}>
              Showing {displayList.length} of {userExpenses.length} expense{userExpenses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Right Column: Category Summary */}
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Expenses by category</h3>

          <div className={styles.categoryList}>
            {loading ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>
            ) : categoryExpensesData.length === 0 ? (
              <div className={styles.categoryItem}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>No expenses found</span>
                  <span className={styles.categoryAmount}></span>
                </div>
              </div>
            ) : (
              categoryExpensesData.map((cat, index) => (
                <div key={index} className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={styles.categoryAmount}>{cat.amount}</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: cat.percentage }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{cat.percentage}</span>
                </div>
              ))
            )}
          </div>

          <div className={styles.summaryFooter}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>R {totalAmountForExpenses.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Expenses;
