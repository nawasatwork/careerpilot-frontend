const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
        return null;
    }
}

export function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Decode the JWT payload and check `exp` without a network round trip.
// This is a UX guard only; the backend verifies the signature on every request.
export function isTokenValid() {
    const token = getToken();
    if (!token) {
        return false;
    }

    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const payload = JSON.parse(atob(padded));
        if (!payload?.exp) {
            return true;
        }
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}
