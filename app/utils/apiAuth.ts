/**
 * API Authentication configuration
 * Handles the creation and validation of API headers with proper error handling
 */

class APIAuthError extends Error {
  constructor(message:any) {
    super(message);
    this.name = 'APIAuthError';
  }
}

const getCookie = (name:any) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }
  return null;
};

const createHeaders = () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Validate required environment variables
    if (!baseUrl) {
      throw new APIAuthError('Missing required API credentials in environment variables');
    }

    // Create and configure headers
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    // Retrieve the token from localStorage
    /* if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("logData");
      try {
        const parsedData = storedData ? JSON.parse(storedData) : {};
        const { token } = parsedData;
        if (token) {
          headers.append("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } */

      if (typeof window !== "undefined") {
        const token = getCookie("logData"); // Replace with your cookie name
        // console.log(token, 'tok');
        // console.log(document.cookie, 'all cookies');
        
        if (token) {
          headers.append("Authorization", `Bearer ${token}`);
        }
      }

    // Add security headers
    // headers.append("X-Content-Type-Options", "nosniff");
    // headers.append("X-Frame-Options", "DENY");
    // headers.append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

    return headers;
  } catch (error) {
    console.error('Error creating API headers:', error);
    // Return minimal headers for fallback
    const fallbackHeaders = new Headers();
    fallbackHeaders.append("Content-Type", "application/json");
    return fallbackHeaders;
  }
};

// Create headers once and export
const myHeaders = createHeaders();

export { myHeaders as default, APIAuthError, createHeaders };