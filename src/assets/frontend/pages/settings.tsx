import React, { useEffect, useState } from 'react';
import styles from "../styles/Settings.module.css";
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { getDoc, getDocs, doc, updateDoc, collection, query, where } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { safeNum, safeDate, formatRand, migrateBudgetPlannerGroceries, migrateExpenseCategory } from '../utils/safeguards';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  yearOfStudy: string;
  cityCampus: string;
  twoFactorEnabled?: boolean;
  income: {
    nsfasAllowance: number;
    partTimeWork: number;
    familySupport: number;
    totalIncome: number;
  };
};

const Settings: React.FC = () => {

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    institution: "",
    yearOfStudy: "",
    cityCampus: "",
    twoFactorEnabled: false,
    income: {
      nsfasAllowance: 0,
      partTimeWork: 0,
      familySupport: 0,
      totalIncome: 0,
    }
  });

  // ── 2FA popup state ────────────────────────────────────────────────────
  const [show2FAModal, setShow2FAModal]       = useState(false);
  const [twoFAPending, setTwoFAPending]       = useState(false); // local toggle inside modal
  const [saving2FA, setSaving2FA]             = useState(false);

  // ── PDF download state ─────────────────────────────────────────────────
  const [downloading, setDownloading]         = useState(false);

  const navigate  = useNavigate();
  const uid       = getAuth().currentUser?.uid || "";

  // ── Data fetching ──────────────────────────────────────────────────────
  const getUserData = async () => {
    try {
      if (!uid) { navigate("/"); return; }

      const snapshot = await getDoc(doc(db, "users", uid));
      const data = snapshot.exists() ? (snapshot.data() as any) : null;

      const firstName = data?.firstName || data?.firstname || "";
      const lastName = data?.lastName || data?.lastname || "";

      setUserData((prev) => ({
        ...prev,
        firstname:         firstName,
        lastname:          lastName,
        email:             data?.email ?? "",
        institution:       data?.institution ?? "",
        yearOfStudy:       data?.yearOfStudy ?? "",
        cityCampus:        data?.cityCampus ?? "",
        twoFactorEnabled:  data?.twoFactorEnabled ?? false,
        income: {
          nsfasAllowance: safeNum(data?.income?.nsfasAllowance),
          partTimeWork:   safeNum(data?.income?.partTimeWork),
          familySupport:  safeNum(data?.income?.familySupport),
          totalIncome:    safeNum(data?.income?.totalIncome),
        }
      }));
    } catch (e) {
      console.log("Error occured: " + e);
      // On error, set safe defaults
      setUserData((prev) => ({
        ...prev,
        firstname: "",
        lastname: "",
        email: "",
        institution: "",
        yearOfStudy: "",
        cityCampus: "",
        twoFactorEnabled: false,
        income: {
          nsfasAllowance: 0,
          partTimeWork: 0,
          familySupport: 0,
          totalIncome: 0,
        }
      }));
    }
  };

  const updateUserData = async () => {
    try {
      await updateDoc(doc(db, "users", uid), {
        firstName:   userData.firstname,
        lastName:    userData.lastname,
        firstname:   userData.firstname,
        lastname:    userData.lastname,
        email:       userData.email,
        institution: userData.institution,
        yearOfStudy: userData.yearOfStudy,
        cityCampus:  userData.cityCampus,
      });
      console.log("User data updated");
    } catch (e) {
      console.log("Error occured" + e);
    }
  };

  const deactivateAccount = async () => {
    try {
      await updateDoc(doc(db, "users", uid), { isActive: false });
      signUserOut();
    } catch (e) {
      console.log("User account could not be deactivated");
    }
  };

  const resetUserData = async () => {
    try { await getUserData(); } catch (e) { console.log("User data could not be reset"); }
  };

  const signUserOut = async () => {
    try {
      await getAuth().signOut();
      navigate("/", { replace: true });
    } catch (e) {
      console.log("Could not sign user out");
    }
  };

  useEffect(() => { getUserData(); }, []);

  // ── 2FA modal handlers ─────────────────────────────────────────────────
  const open2FAModal = () => {
    setTwoFAPending(userData.twoFactorEnabled); // initialise toggle to current value
    setShow2FAModal(true);
  };

  const save2FA = async () => {
    try {
      setSaving2FA(true);
      await updateDoc(doc(db, "users", uid), { twoFactorEnabled: twoFAPending });
      setUserData((prev) => ({ ...prev, twoFactorEnabled: twoFAPending }));
      setShow2FAModal(false);
    } catch (e) {
      console.log("Could not update 2FA setting: " + e);
    } finally {
      setSaving2FA(false);
    }
  };

  // ── PDF download ───────────────────────────────────────────────────────
  const downloadDataAsPDF = async () => {
    try {
      setDownloading(true);

      // Fetch expenses for this user
      const expensesSnap = await getDocs(
        query(collection(db, "expenses"), where("userId", "==", uid))
      );
      const expenses = expensesSnap.docs.map((d) =>
        migrateExpenseCategory(db, d.data() as any, d.id)
      );

      // Fetch budget planner
      const budgetRef = doc(db, "budget_planner", uid);
      const budgetSnap = await getDoc(budgetRef);
      const rawBudget = budgetSnap.exists() ? budgetSnap.data() : null;
      const budget = await migrateBudgetPlannerGroceries(budgetRef, rawBudget);

      // ── Build PDF ──────────────────────────────────────────────────────
      const pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const margin = 18;
      const col2  = pageW / 2 + 4;
      let y       = 20;

      const line = (extra = 0) => {
        y += extra;
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, y, pageW - margin, y);
        y += 4;
      };

      const heading = (text: string) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(31, 67, 99);
        pdf.text(text.toUpperCase(), margin, y);
        y += 6;
        line();
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(9.5);
      };

      const row = (label: string, value: string, x = margin) => {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(8.5);
        pdf.text(label, x, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 30, 30);
        pdf.setFontSize(9.5);
        pdf.text(value, x, y + 4.5);
        y += 11;
      };

      const checkPage = (needed = 14) => {
        if (y + needed > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          y = 20;
        }
      };

      // ── Cover header ───────────────────────────────────────────────────
      pdf.setFillColor(31, 67, 99);
      pdf.rect(0, 0, pageW, 28, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text("StudentSpend SA", margin, 12);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("Personal Financial Data Export", margin, 20);
      pdf.text(`Generated: ${new Date().toLocaleDateString("en-ZA", { dateStyle: "long" })}`, pageW - margin, 20, { align: "right" });
      y = 38;

      // ── Section 1: Profile ─────────────────────────────────────────────
      heading("Profile");
      const savedY = y;
      row("First name",   userData.firstname || "—");
      row("Institution",  userData.institution || "—");
      row("Year of study",userData.yearOfStudy || "—");
      y = savedY;
      row("Last name",    userData.lastname || "—",  col2);
      row("Campus / City",userData.cityCampus || "—",col2);
      row("Email",        userData.email || "—",     col2);
      y += 2;

      // ── Section 2: Income ──────────────────────────────────────────────
      checkPage(50);
      heading("Income sources");
      const incY = y;
      row("NSFAS allowance", formatRand(userData.income.nsfasAllowance));
      row("Family support",  formatRand(userData.income.familySupport));
      y = incY;
      row("Part-time work",  formatRand(userData.income.partTimeWork), col2);
      row("Total monthly",   formatRand(userData.income.totalIncome), col2);
      y += 2;

      // ── Section 3: Budget allocations ─────────────────────────────────
      if (budget) {
        checkPage(60);
        heading("Budget allocations");
        const cats = ["transport","food","rent","dataAndAirtime","entertainment","other"];
        const labels: Record<string,string> = {
          transport:"Transport", food:"Food", rent:"Rent",
          dataAndAirtime:"Data & Airtime", entertainment:"Entertainment", other:"Other"
        };
        cats.forEach((cat, i) => {
          if (i % 2 === 0) { checkPage(14); }
          const x = i % 2 === 0 ? margin : col2;
          row(labels[cat], formatRand(budget[cat]), x);
          if (i % 2 === 0) y -= 11; // keep same row for next column
        });
        y += 11;
      }

      // ── Section 4: Expense history ─────────────────────────────────────
      checkPage(30);
      heading(`Expense history (${expenses.length} records)`);

      if (expenses.length === 0) {
        pdf.setTextColor(150, 150, 150);
        pdf.text("No expenses recorded.", margin, y);
        y += 8;
      } else {
        // Table header
        pdf.setFillColor(245, 246, 247);
        pdf.rect(margin, y - 4, pageW - margin * 2, 8, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text("DATE",        margin + 2,       y);
        pdf.text("CATEGORY",    margin + 32,      y);
        pdf.text("DESCRIPTION", margin + 64,      y);
        pdf.text("AMOUNT",      pageW - margin - 2, y, { align: "right" });
        y += 6;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);

        // Sort newest first
        const sorted = [...expenses].sort((a, b) => {
          const dA = safeDate(a.date || (a as any).createdAt);
          const dB = safeDate(b.date || (b as any).createdAt);
          return dB.getTime() - dA.getTime();
        });

        sorted.forEach((exp, i) => {
          checkPage(8);
          const rowBg = i % 2 === 0;
          if (rowBg) {
            pdf.setFillColor(251, 251, 251);
            pdf.rect(margin, y - 3.5, pageW - margin * 2, 7, "F");
          }
          pdf.setTextColor(60, 60, 60);
          const d = safeDate(exp.date || (exp as any).createdAt);
          pdf.text(d.toLocaleDateString("en-ZA"), margin + 2, y);
          pdf.text(String(exp.category ?? "—").slice(0, 14), margin + 32, y);

          const desc = String(exp.description ?? "—");
          pdf.text(desc.length > 28 ? desc.slice(0, 27) + "…" : desc, margin + 64, y);

          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(31, 67, 99);
          pdf.text(formatRand(exp.amount), pageW - margin - 2, y, { align: "right" });
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          y += 7;
        });

        // Total row
        y += 2;
        pdf.setDrawColor(180, 180, 180);
        pdf.line(margin, y, pageW - margin, y);
        y += 5;
        const total = sorted.reduce((s, e) => s + safeNum(e.amount), 0);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        pdf.setTextColor(31, 67, 99);
        pdf.text("Total spent", margin + 2, y);
        pdf.text(`R ${safeNum(total).toFixed(2)}`, pageW - margin - 2, y, { align: "right" });
      }

      // ── Footer on every page ───────────────────────────────────────────
      const pageCount = (pdf.internal as any).getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        pdf.setPage(p);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(180, 180, 180);
        pdf.text(
          `StudentSpend SA — Confidential financial export — Page ${p} of ${pageCount}`,
          pageW / 2,
          pdf.internal.pageSize.getHeight() - 8,
          { align: "center" }
        );
      }

      // ── Save ───────────────────────────────────────────────────────────
      const filename = `StudentSpend_${(userData.firstname || "user").toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);

    } catch (e) {
      console.log("Error generating PDF: " + e);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Account</h1>

      <div className={styles.layout}>

        {/* Left Column */}
        <div className={styles.leftColumn}>

          {/* Profile Details Card */}
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {(userData?.firstname?.charAt(0) || "") + (userData?.lastname?.charAt(0) || "")}
              </div>
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>{userData.firstname}</h2>
              </div>
              <button className={styles.linkBtn}>Change photo</button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input type="text" className={styles.input} disabled value={userData.email} placeholder="email@gmail.com" />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Institution</label>
                <input
                  type="text" className={styles.input} value={userData.institution}
                  onChange={(e) => setUserData((prev) => ({ ...prev, institution: e.target.value }))}
                  placeholder="CPUT"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Year of study</label>
                <input
                  type="text" className={styles.input} value={userData.yearOfStudy}
                  onChange={(e) => setUserData((prev) => ({ ...prev, yearOfStudy: e.target.value }))}
                  placeholder="Second year"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>City or campus</label>
                <input
                  type="text" className={styles.input} value={userData.cityCampus}
                  onChange={(e) => setUserData((prev) => ({ ...prev, cityCampus: e.target.value }))}
                  placeholder="District 6, Cape Town"
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.primaryBtn} onClick={updateUserData}>Save changes</button>
              <button className={styles.secondaryBtn} onClick={resetUserData}>Cancel</button>
            </div>
          </div>

          {/* Income Sources Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Income sources</h3>
            <div className={styles.incomeList}>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>NSFAS allowance</span>
                <span className={styles.incomeValue}>R {userData.income.nsfasAllowance}</span>
              </div>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>Part-time work</span>
                <span className={styles.incomeValue}>R {userData.income.partTimeWork}</span>
              </div>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>Family support</span>
                <span className={styles.incomeValue}>R {userData.income.familySupport}</span>
              </div>
            </div>
            <div className={styles.incomeTotal}>
              <span className={styles.totalLabel}>Total monthly income</span>
              <span className={styles.totalValue}>R {userData.income.totalIncome}</span>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>

          {/* Security Card — only 2FA row, password + devices removed */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Security</h3>
            <div className={styles.securityList}>
              <div className={styles.securityRow}>
                <div className={styles.securityInfo}>
                  <h4 className={styles.securityItemTitle}>Two-step authentication</h4>
                  <p className={`${styles.securityItemDesc} ${userData.twoFactorEnabled ? styles.textGreen : ''}`}>
                    {userData.twoFactorEnabled ? "On, by email" : "Off"}
                  </p>
                </div>
                <button className={styles.linkBtn} onClick={open2FAModal}>Manage</button>
              </div>
            </div>
          </div>

          {/* Your Data Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Your data</h3>
            <p className={styles.dataText}>
              Your records are visible to you only. Download everything as a PDF, or close the account and remove it.
            </p>
            <div className={styles.dataActions}>
              <button
                className={styles.outlineBtn}
                onClick={downloadDataAsPDF}
                disabled={downloading}
              >
                {downloading ? "Generating…" : "Download my data"}
              </button>
              <button className={styles.dangerBtn} onClick={deactivateAccount}>
                Deactivate<br />account
              </button>
            </div>
          </div>

          {/* Log Out */}
          <button className={styles.logoutBtn} onClick={signUserOut}>Log out</button>

        </div>
      </div>

      {/* ── 2FA Modal ─────────────────────────────────────────────────────── */}
      {show2FAModal && (
        <div className={styles.modalOverlay} onClick={() => setShow2FAModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            <h2 className={styles.modalTitle}>Two-step authentication</h2>
            <p className={styles.modalDesc}>
              When turned on, we will send a one-time code to your email each time you log in.
            </p>

            {/* Toggle switch */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Two-step authentication</span>
                <span className={`${styles.toggleStatus} ${twoFAPending ? styles.textGreen : styles.textMuted}`}>
                  {twoFAPending ? "On, by email" : "Off"}
                </span>
              </div>

              <button
                className={`${styles.toggle} ${twoFAPending ? styles.toggleOn : styles.toggleOff}`}
                onClick={() => setTwoFAPending((prev) => !prev)}
                aria-label={twoFAPending ? "Turn off two-step authentication" : "Turn on two-step authentication"}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.primaryBtn} onClick={save2FA} disabled={saving2FA}>
                {saving2FA ? "Saving…" : "Save"}
              </button>
              <button className={styles.secondaryBtn} onClick={() => setShow2FAModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
