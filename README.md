# Reels AutoPoster

אפליקציה להעלאת רילס אוטומטית ל-Trial Flow מדי יום, באמצעות GetLate API ו-Supabase.

## דפים

- **הרשמה** (`/signup`) – הרשמה עם אימייל וסיסמה
- **התחברות** (`/login`) – התחברות, איפוס סיסמה (Supabase)
- **חיבור אינסטגרם** (`/connect-instagram`) – חיבור חשבון דרך GetLate (OAuth)
- **טעינת פוסטים** (`/posts/loading`) – אחרי חיבור: טעינת רשימת פוסטים מ-GetLate Analytics (דורש תוסף Analytics ב-GetLate)
- **בחירת פוסטים** (`/posts`) – רשימת פוסטים מ-GetLate Analytics, בחירה להעלאה יומית, התנתקות

## התקנה

```bash
npm install
cp .env.example .env
```

ב-`.env` הגדר:

- `VITE_SUPABASE_URL` – כתובת הפרויקט ב-Supabase
- `VITE_SUPABASE_ANON_KEY` – מפתח anon (public)
- `VITE_GETLATE_API_KEY` – מפתח API של GetLate (מ־[getlate.dev](https://getlate.dev) / [docs.getlate.dev](https://docs.getlate.dev)); משמש לחיבור OAuth ו־Analytics (רשימת פוסטים). רשימת הפוסטים מגיעה מ־[GetLate Analytics](https://docs.getlate.dev/core/analytics) וייתכן שידרש תוסף Analytics בחשבון GetLate.
- (אופציונלי) `SUPABASE_ACCESS_TOKEN` – לסקריפט הפעלת Email (מ־[https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)).

## הפעלת Email Auth

אם מתקבלת שגיאת "Failed to fetch" בהרשמה/התחברות:

1. צור **Personal Access Token** ב־[https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. הוסף ל־`.env`: `SUPABASE_ACCESS_TOKEN=sbp_...`
3. הרץ: `npm run enable-email-auth`

או הפעל ידנית: Supabase Dashboard → Authentication → Providers → Email → ON.

## יצירת הטבלאות ב-Supabase

**אפשרות 1 – Supabase SQL Editor**  
פתח את הפרויקט ב-Supabase → SQL Editor והרץ את התוכן של `supabase-schema.sql`. אם הטבלאות כבר קיימות, הרץ את הקבצים ב־`supabase/migrations/` לפי הסדר (כולל `20250131020000_create_user_posts.sql` לטבלת פוסטי המשתמש).

**אפשרות 2 – Supabase CLI**  
אחרי `supabase link` לפרויקט:

```bash
npm run db:push
```

## הרצה

```bash
npm run dev
```

## עיצוב

- עברית, RTL
- פלטת צבעים כחול–לבן בהשראת אינסטגרם
- רספונסיבי למובייל ודסקטופ
