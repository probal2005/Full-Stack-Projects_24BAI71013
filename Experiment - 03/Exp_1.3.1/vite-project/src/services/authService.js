import { generateJWT, decodeJWT } from '../utils/jwtHelper';

// Mock user database
const users = [
  { id: 1, name: 'Probal Dhali', email: '24bai71013@cuchd.in', password: '24BAI71013', role: 'admin' },
  { id: 2, name: 'Probal Dhali', email: '24bai71013@cuchd.in', password: '24bai71013', role: 'user' }
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
    return null; // expired
  }
  return payload;
}

export function logout() {
  localStorage.removeItem('auth_token');
}