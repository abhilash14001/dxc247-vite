import { logout as adminLogout } from "@dxc247/shared/store/admin/adminSlice";
import { store } from "@dxc247/shared/store";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";

// Admin API helper function
export const adminApi = async (url, method = "GET", data = null) => {
  // Get token from Redux store if not provided
  const authToken = store.getState().admin.token;
  
  
  const config = {
    method: method,
    headers: {
      "Accept": "application/json",
    },
  };

  // Add authorization header if token exists
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }

  // Add data for POST/PUT requests
  if (data && (method === "POST" || method === "PUT")) {
    // Check if data is FormData (for file uploads)
    if (data instanceof FormData) {
      // Don't set Content-Type for FormData, let browser set it with boundary
      config.body = data;
    } else {
      // For JSON data
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${url}`,
      config
    );

    const result = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized - logout admin
      if (response.status === 401) {
        store.dispatch(adminLogout());
        return;
      }
      
      // Create an error object that preserves the response data
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = {
        status: response.status,
        data: result
      };
      throw error;
    }

    return result;
  } catch (error) {
    console.error("Admin API error:", error);
    throw error;
  }
};

// Helper function to check if admin is authenticated
export const isAdminAuthenticated = () => {
  const token = store.getState().admin.token;
  return !!token;
};

// Helper function to get admin user data
export const getAdminUser = () => {
  const user = store.getState().admin.user;
  return user || null;
};


// Admin API methods object
export const adminApiMethods = {
  // Configuration API function

  // Password verification API function
  verifySettingsPassword: async (password) => {
    return await adminApi(`${ADMIN_BASE_PATH}/verify-settings-password`, "POST", { password });
  },

  // Theme API functions
  themeApi: {
    // Get current theme
    getTheme: async () => {
      return await adminApi(`${ADMIN_BASE_PATH}/theme`, "GET");
    },

    // Update theme
    updateTheme: async (themeData) => {
      return await adminApi(`${ADMIN_BASE_PATH}/theme`, "POST", themeData);
    },

    // Reset theme to default
    resetTheme: async () => {
      return await adminApi(`${ADMIN_BASE_PATH}/theme/reset`, "POST");
    },

    // Get available theme presets
    getThemePresets: async () => {
      return await adminApi(`${ADMIN_BASE_PATH}/theme/presets`, "GET");
    },
  },

  // Block Market APIs
  getBlockMarketList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await adminApi(`${ADMIN_BASE_PATH}/block-market/list?${queryString}`, "GET");
  },

  getBlockMarketItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await adminApi(`${ADMIN_BASE_PATH}/block-market/items?${queryString}`, "GET");
  },

  toggleBlockMarket: async (data) => {
    return await adminApi(`${ADMIN_BASE_PATH}/block-market/toggle`, "POST", data);
  },

  getBlockMarketStatus: async (type, id) => {
    return await adminApi(`${ADMIN_BASE_PATH}/block-market/status/${type}/${id}`, "GET");
  },

  // User Book API function
  getUserBook: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return await adminApi(`${ADMIN_BASE_PATH}/user-book?${queryString}`, "GET");
  },

  // Match Lock Users API function
  getMatchLockUsers: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return await adminApi(`${ADMIN_BASE_PATH}/match-lock-users?${queryString}`, "GET");
  },

  // Match Lock Selected Users API function
  matchLockSelectedUsers: async (data) => {
    return await adminApi(`${ADMIN_BASE_PATH}/match-lock-selected-users`, "POST", data);
  },

  // Match Lock API function
  matchLock: async (data) => {
    return await adminApi(`${ADMIN_BASE_PATH}/match-lock`, "POST", data);
  },

  // Transactions API function
  getTransactions: async () => {
    return await adminApi(`${ADMIN_BASE_PATH}/transactions`, "GET");
  },

  // Settings API functions
  getSettings: async () => {
    return await adminApi(`${ADMIN_BASE_PATH}/settings`, "GET");
  },

  updateSettings: async (data) => {
    return await adminApi(`${ADMIN_BASE_PATH}/settings`, "POST", data);
  },

  // Bets API function
  getBets: async () => {
    return await adminApi(`${ADMIN_BASE_PATH}/bets`, "GET");
  },

  // Profile API functions
  changePassword: async (data) => {
    return await adminApi(`${ADMIN_BASE_PATH}/change-password`, "POST", data);
  },
};

