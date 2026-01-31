import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="page privacy-page">
      <div className="privacy-card">
        <Link to="/" className="privacy-back">← חזרה לדף הבית</Link>
        <h1 className="privacy-title">תקנון אתר</h1>

        <section className="privacy-section privacy-intro">
          <p>עודכן לאחרונה: ___</p>
          <p>ברוכים הבאים ל־fastREEL (&quot;האתר&quot;, &quot;הפלטפורמה&quot; או &quot;השירות&quot;). האתר מופעל ומנוהלת על ידי יותם שממה (&quot;החברה&quot;).</p>
          <p>התקנון שלהלן מסדיר את תנאי השימוש בפלטפורמה. השימוש באתר ובשירות מהווה הסכמה מלאה לכל תנאי תקנון זה. אם אינך מסכים לתנאים – אנא הימנע משימוש בשירות.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">1. כללי</h2>
          <p>1.1 תקנון זה מהווה הסכם משפטי מחייב בין המשתמש לבין החברה.</p>
          <p>1.2 החברה רשאית לעדכן תקנון זה מעת לעת, והנוסח המעודכן יחייב מרגע פרסומו באתר.</p>
          <p>1.3 השימוש בלשון זכר נעשה מטעמי נוחות בלבד ופונה לכל המגדרים.</p>
          <p>1.4 כותרות הסעיפים נועדו לנוחות בלבד.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">2. תיאור השירות</h2>
          <p>2.1 getREEL מספקת שירות אוטומציה לניהול והעלאה חוזרת של תכני וידאו (Reels) קיימים לחשבון האינסטגרם של המשתמש.</p>
          <p>2.2 השירות מאפשר למשתמש:</p>
          <ul>
            <li>לחבר חשבון אינסטגרם אישי</li>
            <li>לבחור רילסים שכבר פורסמו בעבר</li>
            <li>לאשר אוטומציה שמעלה רילסים אלו ל-Trial Flow</li>
          </ul>
          <p>2.3 האוטומציה פועלת כך:</p>
          <ul>
            <li>המערכת תעלה עד 22 רילסים</li>
            <li>תחילה יועלו 20 הרילסים הראשונים שנבחרו</li>
            <li>לאחר מכן תתבצע העלאה ל-Trial Flow, בהתאם להגדרות המערכת</li>
          </ul>
          <p>2.4 Trendz אינה יוצרת תוכן חדש, אינה עורכת את התוכן ואינה אחראית לתוצאות החשיפה.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">3. חיבור לחשבון אינסטגרם</h2>
          <p>3.1 השימוש בשירות מחייב חיבור חשבון אינסטגרם של המשתמש.</p>
          <p>3.2 המשתמש מצהיר כי הוא בעל החשבון או בעל הרשאה חוקית לנהל אותו.</p>
          <p>3.3 החיבור מתבצע באמצעות שירותי צד שלישי (כגון APIs חיצוניים).</p>
          <p>3.4 getREEL אינה אחראית לשינויים, חסימות או הגבלות שיבוצעו על ידי אינסטגרם.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">4. התחייבויות המשתמש</h2>
          <p>המשתמש מתחייב:</p>
          <ul>
            <li>לספק מידע נכון ומדויק</li>
            <li>להשתמש בשירות אך ורק לחשבונות שבבעלותו</li>
            <li>לא להעלות תכנים בלתי חוקיים, מפרי זכויות או פוגעניים</li>
            <li>לא לעשות שימוש בשירות לצורך ספאם, הונאה או הפרת תנאי אינסטגרם</li>
            <li>לשאת באחריות מלאה לתכנים המועלים מחשבונו</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">5. תשלומים והחזרים</h2>
          <p>5.1 השימוש בשירות כרוך בתשלום מראש בהתאם לחבילה שנבחרה.</p>
          <p>5.2 התשלום אינו תלוי במספר צפיות, לידים, מכירות או תוצאות אחרות.</p>
          <p>5.3 לאחר תחילת האוטומציה לא יינתנו החזרים כספיים, למעט במקרים חריגים לפי שיקול דעת החברה.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">6. אחריות ופטור</h2>
          <p>6.1 השירות ניתן כמות שהוא (AS IS).</p>
          <p>6.2 החברה אינה מתחייבת:</p>
          <ul>
            <li>לעלייה בחשיפה</li>
            <li>לגידול בעוקבים</li>
            <li>לתוצאות אלגוריתמיות כלשהן</li>
          </ul>
          <p>6.3 getREEL אינה אחראית לנזקים ישירים או עקיפים, לרבות חסימות, הגבלות או מחיקת תכנים על ידי אינסטגרם.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">7. הפסקת שירות</h2>
          <p>7.1 המשתמש רשאי להפסיק את השימוש בשירות בכל עת.</p>
          <p>7.2 החברה רשאית להפסיק את השירות:</p>
          <ul>
            <li>בהודעה מוקדמת של 30 יום, או</li>
            <li>באופן מיידי במקרה של הפרת תקנון או שימוש אסור</li>
          </ul>
          <p>7.3 הפסקת השירות לא תזכה את המשתמש בהחזר כספי.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">8. קניין רוחני</h2>
          <p>8.1 כל זכויות הקניין הרוחני בפלטפורמה, בקוד, בתהליכים ובמערכת – שייכות לחברה.</p>
          <p>8.2 התכנים המועלים שייכים למשתמש בלבד.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">9. דין וסמכות שיפוט</h2>
          <p>9.1 על תקנון זה יחולו דיני מדינת ישראל בלבד.</p>
          <p>9.2 סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בישראל.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">10. יצירת קשר</h2>
          <p>לשאלות או פניות בנוגע לתקנון:</p>
          <p>📧 <a href="mailto:yotam30086@gmail.com">yotam30086@gmail.com</a></p>
          <p>📞 <a href="tel:0535298158">053-529-8158</a></p>
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
