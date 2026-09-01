// Simple JWT mock – for demo only
export function generateJWT(payload, secret = 'supersecret') {
  const header = { alg: 'HS256', typ: 'JWT' };
  const b64Header = btoa(JSON.stringify(header));
  const b64Payload = btoa(JSON.stringify(payload));
  const signature = btoa(
    JSON.stringify({ h: b64Header, p: b64Payload, s: secret })
  ).slice(0, 32);
  return `${b64Header}.${b64Payload}.${signature}`;
}

export function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (_) {
    return null;
  }
}

export function getTokenParts(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return {
      header: parts[0],
      payload: parts[1],
      signature: parts[2].slice(0, 16) + '…'
    };
  } catch (_) {
    return null;
  }
}