import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import tipsData from './tipsData';
import styles from '../styles/TipDetail.module.css';

const categoryColors: Record<string, { bg: string; text: string }> = {
  SAVING:    { bg: '#e8f5e9', text: '#2e7d32' },
  FOOD:      { bg: '#fff8e1', text: '#f57f17' },
  TRANSPORT: { bg: '#e3f2fd', text: '#1565c0' },
  DATA:      { bg: '#f3e5f5', text: '#6a1b9a' },
  BOOKS:     { bg: '#fce4ec', text: '#880e4f' },
};

const TipDetail: React.FC = () => {
  const { tipId } = useParams<{ tipId: string }>();
  const navigate = useNavigate();

  const tip = tipsData.find((t) => t.id === tipId);

  if (!tip) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate('/financialTips')}>
          <ArrowLeft size={16} />
          Back to tips
        </button>
        <div className={styles.notFound}>
          <BookOpen size={48} strokeWidth={1.5} />
          <h2>Tip not found</h2>
          <p>The tip you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const colors = categoryColors[tip.category] ?? { bg: '#f0f0f0', text: '#555' };

  return (
    <div className={styles.container}>

      {/* Back navigation */}
      <button className={styles.backBtn} onClick={() => navigate('/financialTips')}>
        <ArrowLeft size={16} />
        Back to tips
      </button>

      {/* Hero header */}
      <div className={styles.hero}>
        <span
          className={styles.categoryBadge}
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {tip.category}
        </span>
        <h1 className={styles.title}>{tip.title}</h1>
        <p className={styles.teaser}>{tip.description}</p>
      </div>

      {/* Expanded sections */}
      <div className={styles.sectionsGrid}>
        {tip.sections.map((section, i) => (
          <div key={i} className={styles.sectionCard}>
            <h2 className={styles.sectionHeading}>{section.heading}</h2>
            <p className={styles.sectionBody}>{section.body}</p>
          </div>
        ))}
      </div>

      {/* Action steps */}
      <div className={styles.actionCard}>
        <h2 className={styles.actionTitle}>Try this</h2>
        <ol className={styles.actionList}>
          {tip.actionSteps.map((step, i) => (
            <li key={i} className={styles.actionItem}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Related tips */}
      <div className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>More tips</h2>
        <div className={styles.relatedGrid}>
          {tipsData
            .filter((t) => t.id !== tip.id)
            .slice(0, 3)
            .map((related) => {
              const rc = categoryColors[related.category] ?? { bg: '#f0f0f0', text: '#555' };
              return (
                <button
                  key={related.id}
                  className={styles.relatedCard}
                  onClick={() => navigate(`/financialTips/${related.id}`)}
                >
                  <span
                    className={styles.relatedBadge}
                    style={{ backgroundColor: rc.bg, color: rc.text }}
                  >
                    {related.category}
                  </span>
                  <p className={styles.relatedCardTitle}>{related.title}</p>
                  <span className={styles.relatedReadMore}>Read more →</span>
                </button>
              );
            })}
        </div>
      </div>

    </div>
  );
};

export default TipDetail;

