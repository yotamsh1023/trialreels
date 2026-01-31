import { Link } from 'react-router-dom'

const iconSize = { width: 22, height: 22 }
const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

function LightningIcon() {
  return (
    <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

/* Smooth upward trend — "things are improving" */
function LiveChart() {
  const pathPrimary = 'M 0 60 Q 25 55 50 45 T 100 30 T 150 22 T 200 18 T 250 12 T 280 8'
  const pathSecondary = 'M 0 55 Q 30 50 60 42 T 120 32 T 180 28 T 240 22 T 280 18'
  return (
    <svg className="landing-chart-svg" viewBox="0 0 280 80" preserveAspectRatio="none">
      <path className="landing-chart-line landing-chart-line-alt" d={pathSecondary} style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'landing-chart-draw 2s ease-out forwards' }} />
      <path className="landing-chart-line" d={pathPrimary} style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'landing-chart-draw 1.8s ease-out 0.2s forwards' }} />
    </svg>
  )
}

function FeatureIcon({ name }) {
  switch (name) {
    case 'instagram': return <InstagramIcon />
    case 'video': return <VideoIcon />
    case 'target': return <TargetIcon />
    default: return <LightningIcon />
  }
}

export default function Landing() {
  const features = [
    { title: 'חיבור אינסטגרם', desc: 'חבר פעם אחת ומשם המערכת עובדת בשבילך.', highlight: true, icon: 'instagram' },
    { title: 'בחירת רילסים', desc: 'בחר אילו רילסים להעלות. השאר אוטומטי.', highlight: false, icon: 'video' },
    { title: 'העלאה אוטומטית', desc: 'כל יום Trial Reels חדשים בלי שתעשה כלום.', highlight: false, icon: 'lightning' },
    { title: 'יותר חשיפה', desc: 'האלגוריתם אוהב תנועה. יותר רילסים = יותר הזדמנויות.', highlight: false, icon: 'target' },
  ]

  return (
    <div className="landing landing-dark">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo-icon" aria-hidden>TR</span>
            <span className="landing-logo-text">Trial Reels</span>
          </Link>
          <nav className="landing-nav">
            <Link to="/login" className="landing-nav-link">כניסה</Link>
            <Link to="/signup" className="landing-cta-btn">התחל בחינם</Link>
          </nav>
        </div>
      </header>

      {/* Hero: two-column + feature blocks */}
      <section className="landing-hero-dark">
        <div className="landing-hero-bg-dark" aria-hidden />
        <div className="landing-hero-inner-dark">
          <div className="landing-hero-left">
            <span className="landing-hero-badge">
              <span className="landing-hero-badge-dot" aria-hidden />
              הפצה אוטומטית
            </span>
            <h1 className="landing-hero-title-dark">
              <span className="landing-hero-icon-wrap">
                <LightningIcon />
              </span>
              <span className="landing-hero-title-main">הפוך כל ריל שכבר העלית</span>
              <span className="landing-hero-title-sub">למכונת חשיפה שעובדת לבד</span>
            </h1>
            <p className="landing-hero-sub-dark">
              אנחנו לוקחים את הרילסים שכבר פרסמת באינסטגרם ומעלים אותם אוטומטית כ-Trial Reels מה שאומר עוד צפיות, עוקבים ואינטראקציות. בלי שתעשה כלום.
            </p>
            <Link to="/signup" className="landing-cta-btn landing-cta-btn-large">חבר את האינסטגרם שלך</Link>
          </div>
          <div className="landing-hero-right">
            <div className="landing-panels-wrap">
              <div className="landing-panel landing-panel-feed">
                <div className="landing-feed-line">
                  <span className="landing-feed-dot" aria-hidden />
                  <span className="landing-feed-label">רילסים חדשים</span>
                  <span className="landing-feed-value">+0</span>
                </div>
                <div className="landing-feed-line">
                  <span className="landing-feed-dot" aria-hidden />
                  <span className="landing-feed-label">העלאות חדשות</span>
                  <span className="landing-feed-value">+20</span>
                </div>
                <div className="landing-feed-line">
                  <span className="landing-feed-dot" aria-hidden />
                  <span className="landing-feed-label">חשיפה</span>
                  <span className="landing-feed-value">+77%</span>
                </div>
              </div>
              <div className="landing-panel landing-panel-chart landing-panel-glow">
                <p className="landing-chart-label">מגמה</p>
                <LiveChart />
              </div>
              <div className="landing-panel landing-panel-stat">
                <p className="landing-stat-big">77%</p>
                <p className="landing-stat-desc">חשיפה מבוססת רילסים</p>
              </div>
            </div>
          </div>
        </div>
        {/* One long card with separators */}
        <div className="landing-features-card">
          {features.map((f, i) => (
            <div key={i} className={`landing-feature-cell ${f.highlight ? 'landing-feature-cell-active' : ''}`}>
              <span className="landing-feature-icon"><FeatureIcon name={f.icon} /></span>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="landing-section landing-section-dark">
        <div className="landing-container">
          <span className="landing-section-badge landing-section-badge-dark">
            <span className="landing-section-badge-dot" aria-hidden />
            איך זה עובד
          </span>
          <div className="landing-steps">
            <div className="landing-step">
              <span className="landing-step-num">1</span>
              <p className="landing-step-text landing-step-text-dark"> התחברות לאינסטגרם בלחיצת כפתור </p>
            </div>  
            <div className="landing-step">
              <span className="landing-step-num">2</span>
              <p className="landing-step-text landing-step-text-dark">בחירת רילסים לפרסום</p>
            </div>
            <div className="landing-step">
              <span className="landing-step-num">3</span>
              <p className="landing-step-text landing-step-text-dark">כל השאר עולים אוטומטית כל יום</p>
            </div>
          </div>
          <p className="landing-steps-tagline landing-steps-tagline-dark">בלי זמנים · בלי תזמון · בלי ניהול</p>
        </div>
      </section>

      {/* Why it works */}
      <section className="landing-section landing-section-dark landing-section-alt-dark">
        <div className="landing-container">
          <span className="landing-section-badge landing-section-badge-dark">
            <span className="landing-section-badge-dot" aria-hidden />
            למה זה עובד
          </span>
          <h2 className="landing-section-title landing-section-title-dark">האלגוריתם אוהב תנועה. לא מושלמות.</h2>
          <p className="landing-section-lead landing-section-lead-dark">
            Trial Reels הם הדרך של אינסטגרם לבדוק תוכן מול קהלים חדשים. <br></br>ככל שיש לך יותר רילסים שרצים - יש יותר הזדמנויות להתפוצץ.
          </p>
          <div className="landing-compare">
            <div className="landing-compare-box">
              <p className="landing-compare-label landing-compare-label-dark">אבל רוב האנשים:</p>
              <ul className="landing-compare-list landing-compare-list-dark">
                <li>מעלים ריל</li>
                <li>שוכחים ממנו</li>
                <li>עוברים לבא</li>
              </ul>
            </div>
            <div className="landing-compare-box landing-compare-box-you-dark">
              <p className="landing-compare-label landing-compare-label-dark">אתה:</p>
              <p className="landing-compare-you landing-compare-you-dark">נותן לכל הרילסים שלך הזדמנות נוספת לעבוד בשבילך.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for — one long card with glowing separators */}
      <section className="landing-section landing-section-dark">
        <div className="landing-container">
          <span className="landing-section-badge landing-section-badge-dark">
            <span className="landing-section-badge-dot" aria-hidden />
            למי זה מיועד
          </span>
          <div className="landing-who-card">
            <div className="landing-who-block">
              <ul className="landing-who-audience">
                <li><span className="landing-who-dot" aria-hidden />יוצרי תוכן</li>
                <li><span className="landing-who-dot" aria-hidden />בעלי עסקים שמעלים רילסים</li>
                <li><span className="landing-who-dot" aria-hidden />סוכנויות</li>
                <li><span className="landing-who-dot" aria-hidden />אנשים שכבר יוצרים - אבל לא רוצים לנהל</li>
              </ul>
            </div>
            <div className="landing-who-sep" aria-hidden />
            <div className="landing-who-block landing-who-not">
              <p className="landing-who-label">זה לא</p>
              <p className="landing-who-muted">כלי לעריכה · כלי פרסום · כלי אנליטיקה</p>
            </div>
            <div className="landing-who-sep" aria-hidden />
            <div className="landing-who-block landing-who-yes">
              <p className="landing-who-label">זה</p>
              <p className="landing-who-highlight">מנוע הפצה אוטומטי למה שכבר קיים</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it feels */}
      <section className="landing-section landing-section-dark landing-section-alt-dark">
        <div className="landing-container landing-container-narrow">
          <span className="landing-section-badge landing-section-badge-dark">
            <span className="landing-section-badge-dot" aria-hidden />
            איך זה מרגיש
          </span>
          <p className="landing-feel landing-feel-dark">
            במקום לשאול כל יום "מה אני אעלה היום?"<br></br> אתה יודע שהדברים שכבר עשית - עובדים בשבילך.
          </p>
          <p className="landing-feel-tagline landing-feel-tagline-dark">יותר שקט. יותר חשיפה. אותו תוכן.</p>
        </div>
      </section>

      {/* Notice: Trial option required */}
      <section className="landing-section landing-section-dark landing-section-alt-dark">
        <div className="landing-container landing-container-narrow">
          <span className="landing-section-badge landing-section-badge-dark">
            <span className="landing-section-badge-dot" aria-hidden />
            שים לב
          </span>
          <div className="landing-notice landing-notice-dark">
            <p className="landing-notice-text">
              השימוש בשירות זמין רק למי שיש את האופציה של Trial באינסטגרם.
            </p>
            <p className="landing-notice-text">
              מי שאין לו - זה לא יעבוד.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section landing-cta-section-dark">
        <div className="landing-cta-bg-dark" aria-hidden />
        <div className="landing-container landing-container-narrow">
          <h2 className="landing-cta-title landing-cta-title-dark">חבר את האינסטגרם שלך<br />ותן למערכת להתחיל לעבוד</h2>
          <p className="landing-cta-sub landing-cta-sub-dark">שום מחיר. שום התחייבות. רק חיבור.</p>
          <Link to="/signup" className="landing-cta-btn landing-cta-btn-large">חבר את האינסטגרם שלך</Link>
        </div>
      </section>

      <footer className="landing-footer landing-footer-dark">
        <div className="landing-container">
          <div className="landing-footer-owner">
            <p className="landing-footer-owner-title">פרטי בעל האתר ובעל השליטה במאגר המידע</p>
            <p className="landing-footer-owner-line">שם: יותם שממה</p>
            <p className="landing-footer-owner-line">דוא״ל: <a href="mailto:yotam30086@gmail.com">yotam30086@gmail.com</a></p>
            <p className="landing-footer-owner-line">טלפון: <a href="tel:0535298158">053-529-8158</a></p>
            <p className="landing-footer-owner-line">כתובת אתר: ___</p>
          </div>
          <p className="landing-footer-text landing-footer-text-dark">
            Trial Reels · מנוע הפצה אוטומטי לרילסים שלך
            {' · '}
            <Link to="/privacy" className="landing-footer-link">מדיניות ופרטיות</Link>
            {' · '}
            <Link to="/terms" className="landing-footer-link">תקנון</Link>
            {' · '}
            <Link to="/accessibility" className="landing-footer-link">הצהרת נגישות</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
