import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="page privacy-page">
      <div className="privacy-card">
        <Link to="/" className="privacy-back">← חזרה לדף הבית</Link>
        <h1 className="privacy-title">מדיניות ופרטיות</h1>

        <section className="privacy-section privacy-intro">
          <p>ברוכים הבאים ל־(&quot;הפלטפורמה&quot;, &quot;האתר&quot; או &quot;השירות&quot;). הפלטפורמה מופעלת ומנוהלת על ידי יותם שממה (&quot;בעל האתר&quot;, &quot;החברה&quot;).</p>
          <p>אנו מכבדים את פרטיות המשתמשים ומחויבים להגן על המידע האישי שלהם. מטרת מדיניות זו היא להסביר בשקיפות כיצד נאסף, נשמר, מעובד ונעשה שימוש במידע בעת השימוש בפלטפורמה, המספקת שירותי אוטומציה לפרסום תכנים ברשתות חברתיות.</p>
          <p>מדיניות זו מנוסחת בלשון זכר מטעמי נוחות בלבד ומתייחסת לכל המגדרים.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">פרטי בעל האתר ובעל השליטה במאגר המידע</h2>
          <ul className="privacy-contact-list">
            <li>שם: יותם שממה</li>
            <li>דוא״ל: <a href="mailto:yotam30086@gmail.com">yotam30086@gmail.com</a></li>
            <li>טלפון: <a href="tel:0535298158">053-529-8158</a></li>
            <li>כתובת אתר: ___</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">1. כללי</h2>
          <p>1.1 אנו מתחייבים לפעול בהתאם להוראות חוק הגנת הפרטיות, התשמ״א-1981 והתקנות מכוחו.</p>
          <p>1.2 מדיניות זו מסבירה איזה מידע נאסף, כיצד נעשה בו שימוש ומהן זכויות המשתמש.</p>
          <p>1.3 עצם השימוש בפלטפורמה מהווה הסכמה למדיניות זו.</p>
          <p>1.4 אינך מחויב למסור מידע אישי, אולם מסירת מידע מסוים הינה תנאי לשימוש מלא בשירות.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">2. המידע שאנו אוספים</h2>
          <p><strong>2.1 מידע מזהה אישית</strong></p>
          <ul>
            <li>שם מלא</li>
            <li>כתובת דוא״ל</li>
            <li>מספר טלפון</li>
            <li>פרטי התחברות לחשבון</li>
            <li>מזהי חשבון אינסטגרם המחובר לפלטפורמה</li>
            <li>מזהי פוסטים / רילסים שנבחרו לאוטומציה</li>
            <li>תיעוד פעולות ושימוש במערכת</li>
            <li>מידע הנמסר בעת פנייה לתמיכה</li>
            <li>הקלטות שיחה (ככל שיתבצעו)</li>
          </ul>
          <p><strong>2.2 מידע שאינו מזהה אישית</strong></p>
          <ul>
            <li>סוג מכשיר ודפדפן</li>
            <li>כתובת IP</li>
            <li>זמני שימוש, דפוסי גלישה ופעולות</li>
            <li>העדפות משתמש</li>
            <li>נתונים סטטיסטיים ואנליטיים</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">3. שמירת מידע ואחסון</h2>
          <p>3.1 המידע נשמר במאגרי מידע שבשליטת בעל האתר.</p>
          <p>3.2 הנתונים מאוחסנים בשרתי צד שלישי, בישראל ו/או מחוץ לישראל.</p>
          <p>3.3 השימוש בפלטפורמה מהווה הסכמה לאחסון המידע בשרתים אלו.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">4. מטרות השימוש במידע</h2>
          <p>המידע נאסף ומעובד לצורך:</p>
          <ul>
            <li>הפעלת הפלטפורמה ומתן השירות</li>
            <li>חיבור וניהול חשבון אינסטגרם</li>
            <li>אוטומציה של העלאת תכנים ל-Trial Flow</li>
            <li>ניהול תהליכי אוטומציה</li>
            <li>תפעול, תחזוקה ושיפור השירות</li>
            <li>יצירת קשר, תמיכה ומתן מענה לפניות</li>
            <li>שליחת הודעות ועדכונים (בהסכמה)</li>
            <li>ניתוח נתונים סטטיסטיים</li>
            <li>אבטחת מידע ומניעת שימוש לרעה</li>
            <li>עמידה בדרישות הדין</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">5. הבסיס החוקי לעיבוד מידע</h2>
          <p>עיבוד המידע מתבצע על בסיס אחד או יותר מהבאים:</p>
          <ul>
            <li>הסכמת המשתמש</li>
            <li>קיום הסכם (תנאי השימוש)</li>
            <li>חובה חוקית</li>
            <li>אינטרס לגיטימי של בעל האתר</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">6. דיוור ויצירת קשר</h2>
          <p>6.1 בעל האתר רשאי לשלוח הודעות מערכת, התראות ועדכונים תפעוליים.</p>
          <p>6.2 דיוור שיווקי יישלח רק לאחר קבלת הסכמה מפורשת.</p>
          <p>6.3 ניתן לבטל הסכמה בכל עת באמצעות פנייה לבעל האתר.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">7. העברת מידע לצדדים שלישיים</h2>
          <p>המידע עשוי להיות מועבר אך ורק לצורך תפעול השירות אל:</p>
          <ul>
            <li>אימות משתמשים ואחסון מידע</li>
            <li>לצורך אוטומציית פרסום תכנים</li>
            <li>ספקי אחסון ותשתיות</li>
            <li>פלטפורמות אנליטיקה ושיווק (כגון Meta, Google)</li>
            <li>רשויות מוסמכות על פי דין</li>
            <li>במסגרת מיזוג, רכישה או העברת פעילות</li>
          </ul>
          <p>לא יועבר מידע אישי מעבר לנדרש למטרות השירות.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">8. Cookies וטכנולוגיות דומות</h2>
          <p>הפלטפורמה עושה שימוש ב-Cookies לצורך:</p>
          <ul>
            <li>תפעול שוטף</li>
            <li>אבטחה</li>
            <li>סטטיסטיקה וניתוח שימוש</li>
            <li>התאמת חוויית משתמש</li>
          </ul>
          <p>ניתן לחסום או למחוק Cookies דרך הגדרות הדפדפן.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">9. פרסומות של צדדים שלישיים</h2>
          <p>ייתכן שימוש בפרסומות המנוהלות על ידי צדדים שלישיים, הפועלים בהתאם למדיניות הפרטיות שלהם.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">10. אבטחת מידע</h2>
          <p>ננקטים אמצעי אבטחה סבירים ומקובלים, אולם אין אבטחה מוחלטת. המשתמש מודע ומסכים לכך.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">11. זכויות המשתמש</h2>
          <p>בהתאם לחוק:</p>
          <ul>
            <li>זכות עיון במידע</li>
            <li>זכות תיקון או מחיקה</li>
            <li>זכות לפנות בבקשות בנושא פרטיות</li>
          </ul>
          <p>פניות ייענו בתוך זמן סביר.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">12. יצירת קשר</h2>
          <p>לפניות, שאלות או בקשות בנושא פרטיות:</p>
          <p>📧 <a href="mailto:yotam30086@gmail.com">yotam30086@gmail.com</a></p>
          <p>📞 <a href="tel:0535298158">053-529-8158</a></p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">13. שינויים במדיניות</h2>
          <p>מדיניות זו עשויה להתעדכן מעת לעת. שינוי מהותי יפורסם באתר וייכנס לתוקף עם פרסומו.</p>
        </section>

        <p className="privacy-footer-link">
          <Link to="/">חזרה לדף הבית</Link>
          {' · '}
          <Link to="/accessibility">הצהרת נגישות</Link>
        </p>
      </div>
    </div>
  )
}
