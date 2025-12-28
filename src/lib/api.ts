// 🔥 BASE API URL FROM ENV
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

/* SIGNUP */
export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/* LOGIN */
export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/* GOOGLE AUTH */
export async function googleLogin(token: string) {
  const res = await fetch(`${API_BASE}/auth/google/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

/* FETCH USERS */
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/auth/users/`);
  return res.json();
}
