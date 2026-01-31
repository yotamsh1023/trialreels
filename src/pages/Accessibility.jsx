import { Link } from 'react-router-dom'

export default function Accessibility() {
  return (
    <div className="page privacy-page">
      <div className="privacy-card">
        <Link to="/" className="privacy-back">← חזרה לדף הבית</Link>
        <h1 className="privacy-title">הצהרת נגישות</h1>

        <section className="privacy-section privacy-intro">
          <p>
            Trial Reels שואפת להנגיש את השירות לכלל המשתמשים, כולל אנשים עם מוגבלויות.
            דף זה מתאר את יישום תקן ישראלי 5568 לנגישות תכנים באינטרנט (המבוסס על WCAG 2.1 Level AA),
            ואת האמצעים שבהם נקטנו כדי לשפר את חוויית הגלישה.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">עמידה בתקן</h2>
          <p>
            האתר עומד בדרישות תקן ישראלי 5568 (נגישות תכנים באינטרנט – רמה AA),
            המבוסס על הנחיות WCAG 2.1 Level AA של ה-W3C.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">אמצעי נגישות שיושמו</h2>
          <ul>
            <li><strong>שפה וכיוון:</strong> שפת הדף מוגדרת לעברית (lang="he") עם תמיכה מלאה ב-RTL.</li>
            <li><strong>מבנה סמנטי:</strong> שימוש ב-header, nav, main, footer וכותרות היררכיות (H1–H3).</li>
            <li><strong>ניווט מקלדת:</strong> כל הרכיבים האינטראקטיביים ניתנים להפעלה במקלדת, עם סדר טאב לוגי וקישור "דלג לתוכן הראשי".</li>
            <li><strong>ממשק מקלדת:</strong> אינדיקציית פוקוס נראית (outline) על כפתורים, קישורים ושדות טופס.</li>
            <li><strong>טפסים:</strong> לכל שדה תווית נראית ומקושרת (for/id), הודעות שגיאה טקסטואליות, ושדות חובה מסומנים (required / aria-required).</li>
            <li><strong>תמיכה בקוראי מסך:</strong> תמונות עם טקסט חלופי מתאים, תמונות דקורטיביות עם alt="", וכפתורים עם שמות נגישים. הודעות דינמיות (הצלחה/שגיאה) מוכרזות באמצעות aria-live.</li>
            <li><strong>צבע וניגוד:</strong> ניגודיות טקסט של לפחות 4.5:1; אלמנטים אינטראקטיביים ניתנים להבחנה גם ללא הסתמכות על צבע בלבד.</li>
            <li><strong>תנועה:</strong> כיבוי או צמצום אנימציות בהתאם להעדפת המשתמש (prefers-reduced-motion).</li>
            <li><strong>תוכן דינמי:</strong> מצבי טעינה והודעות מוכרזים לקוראי מסך באמצעות אזורי aria-live.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">מגבלות ידועות</h2>
          <p>
            ייתכן שבחלק מדפי צד שלישי (כגון דף ההרשאה של אינסטגרם) רמת הנגישות אינה בשליטתנו.
            באתר עצמו לא מוצגים כרגע סרטוני וידאו עם דיבור; בעת הוספת סרטונים עם דיבור יינתנו כתוביות.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">יצירת קשר בנושא נגישות</h2>
          <p>
            אם נתקלתם בבעיית נגישות או ברצונכם להציע שיפור, נשמח לשמוע:
          </p>
          <ul className="privacy-contact-list">
            <li>דוא״ל: <a href="mailto:yotam30086@gmail.com">yotam30086@gmail.com</a></li>
            <li>טלפון: <a href="tel:0535298158">053-529-8158</a></li>
          </ul>
          <p>נשתדל לטפל בפניות בתוך זמן סביר.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">תאריך עדכון</h2>
          <p>עדכון אחרון: ינואר 2026.</p>
        </section>

        <p className="privacy-footer-link">
          <Link to="/">חזרה לדף הבית</Link>
        </p>
      </div>
    </div>
  )
}
