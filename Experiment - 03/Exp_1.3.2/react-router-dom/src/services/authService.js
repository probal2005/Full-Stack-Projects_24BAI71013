import { generateJWT, decodeJWT } from '../utils/jwtHelper';

// Mock users with different roles
const users = [
  { id: 1, name: 'Admin User', email: 'admin.24bai71013@cuchd.in', password: 'a24bai71013', role: 'admin' },
  { id: 2, name: 'Editor User', email: 'editor.24bai71013@cuchd.in', password: 'e24bai71013', role: 'editor' },
  { id: 3, name: 'Viewer User', email: 'viewer.24bai71013@cuchd.in', password: 'v24bai71013', role: 'viewer' }
];

export function login(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        reject(new Error('Invalid email or password'));
        return;
      }
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      const token = generateJWT(payload);
      resolve({ token, user: { ...user, password: undefined } });
    }, 600);
  });
}

export function getStoredToken() {
  return localStorage.getItem('auth_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getUserFromToken(token) {
  if (!token) return null;
  const payload = decodeJWT(token);
  if (!payload) return null;
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payload;
}

export function logout() {
  localStorage.removeItem('auth_token');
}