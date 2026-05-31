import { jwtDecode } from "jwt-decode";

export const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      return null;
    }
    return decoded;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    return null;
  }
};

export const isAuthenticated = () => Boolean(getDecodedToken());

export const getCurrentUserId = () => getDecodedToken()?.userId || null;
