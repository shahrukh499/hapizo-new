export const setAuthCookie = (token:any) => {
    document.cookie = `logData=${token}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
};

export const clearAuthCookie = () => {
    document.cookie = 'logData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const getCookie = (name:any) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
    return null;
};

export const getAuthToken = () => getCookie("logData");

const decodeBase64Url = (base64Url:any) => {
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    if (typeof atob === "function") {
        return atob(padded);
    }

    // Fallback for non-browser runtimes (shouldn't be hit in client components)
    // eslint-disable-next-line no-undef
    return Buffer.from(padded, "base64").toString("utf-8");
};

export const decodeJwtPayload = (token:any) => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;

    try {
        return JSON.parse(decodeBase64Url(parts[1]));
    } catch {
        return null;
    }
};

export const isJwtExpired = (token:any, skewSeconds:any = 10) => {
    const payload = decodeJwtPayload(token);
    const exp = payload?.exp;
    if (typeof exp !== "number") return true;
    const now = Math.floor(Date.now() / 1000);
    return exp <= now + skewSeconds;
};
