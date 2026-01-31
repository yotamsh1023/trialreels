# Where is the code? – Reels AutoPoster

All page components live in **`src/pages/`**:

| Page              | File path                         | Route                |
|-------------------|-----------------------------------|----------------------|
| Signup            | `src/pages/Signup.jsx`            | `/signup`            |
| Login             | `src/pages/Login.jsx`             | `/login`             |
| Instagram Connect | `src/pages/InstagramConnect.jsx`  | `/connect-instagram`|
| Post Selection    | `src/pages/PostSelection.jsx`     | `/posts`            |

Other files:

- **`src/App.jsx`** – Routes, `ProtectedRoute`, `GuestRoute`, `useAuth`
- **`src/main.jsx`** – React entry, `BrowserRouter`
- **`src/index.css`** – RTL, blue/white theme, forms, buttons
- **`src/lib/supabase.js`** – Supabase client

To run the app: `npm run dev`  
To build: `npm run build`
