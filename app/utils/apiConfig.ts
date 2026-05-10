import { createHeaders, APIAuthError } from "./apiAuth";

/**
 * API Endpoints configuration
 * @type {Object.<string, string>}
 */
const ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  USERS: "/users",
  FORGOTPASSWORD: "/auth/forgot-password",
  FORGOTPASSWORDCONFIRM: "/auth/forgot-password/confirm",
  ALLPRODUCTS: "/products",
  ADDTOCART: "/cart",
  INCREMENTCARTITEM: "/cart/increment",
  DECREMENTCARTITEM: "/cart/decrement",
  PRODUCTDETAILS: "/products",
  APPLYCOUPONCODE: "/coupons/apply-coupon",
  UPLOADPRODUCTIMG: "/products/upload-image",
  ADDPRODUCT: "/products",
  WISHLIST: "/wishlist",
  BANNER: "/home/banner",
  SHOWCASE1: "/home/showcase1",
  ADDRESS: "/addresses",
  ORDERPLACE: "/orders",
  ORDERLIST: "/orders",
  REVIEW: "/products",
  CategoryList: "/products/category-list",
  BrandList: "/products/brand-list",
  REVIEWLIKE: "/reviews",
  UPDATEREVEW: "/reviews",
  NAVBAR: "/navbar",
  LOGINWITHOTP: "/auth/phone-login",
  OTP: "/auth/phone-login",
  verifyPayment: "/verify-payment",
  razorpayOrder: "/create-razorpay-order"
};

/**
 * HTTP Methods configuration
 * @type {Object.<string, string>}
 */
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

/**
 * API Response Status Codes
 * @type {Object.<string, number>}
 */
const STATUS_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

/**
 * Creates API request options with proper configuration
 * @param {string} method - HTTP method
 * @param {Object} [body] - Request body for POST/PUT requests
 * @returns {Object} Request options for fetch
 */
const createRequestOptions = (method:any, body = null) => {
  const options:any = {
    method,
    headers: createHeaders(), // Use createHeaders to get dynamic headers
    redirect: "follow",
  };

  if (
    body &&
    (method === HTTP_METHODS.POST ||
      method === HTTP_METHODS.PUT ||
      method === HTTP_METHODS.DELETE ||
      method === HTTP_METHODS.PATCH)
  ) {
    (options as any).body = JSON.stringify(body);
  }

  return options;
};

/**
 * Main API configuration object
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  ENDPOINTS,
  HTTP_METHODS,
  STATUS_CODES,
  createRequestOptions,
};

/**
 * Helper function to construct full API URL
 * @param {string} endpoint - API endpoint
 * @param {Object} [params] - URL parameters
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint:any, params:any = {}) => {
  const baseUrl = API_CONFIG.BASE_URL;
  const url = new URL(`${baseUrl}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      (url as any).searchParams.append(key, value.toString());
    }
  });

  return (url as any).toString();
};

export { APIAuthError };
