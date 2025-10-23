import { logout as adminLogout } from "@dxc247/shared/store/admin/adminSlice";
import { store } from "@dxc247/shared/store";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import axios from 'axios';

// Admin API helper function
export const adminApi = async (url, method = "GET", data = null) => {
  // Get token from Redux store if not provided
  const authToken = store.getState().admin.token;
  
  // 1️⃣ Generate AES key & IV
  const aesKey = CryptoJS.lib.WordArray.random(32);
  const aesIv = CryptoJS.lib.WordArray.random(16);

  let encryptedPayload = null;

  // 2️⃣ Encrypt payload if it's a POST/PUT/PATCH and has data
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && Object.keys(data || {}).length > 0) {
    const jsonData = JSON.stringify(data);
    encryptedPayload = CryptoJS.AES.encrypt(jsonData, aesKey, {
      iv: aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(); // Base64 string
  }

  // 3️⃣ Get server public key from Redux or fetch from API if not set
  let publicKey = store.getState().commonData.serverPublicKey;
  
  if (!publicKey) {
    try {
      console.log("🔐 Fetching public key from server...");
      const keyResponse = await axios.get(`${import.meta.env.VITE_API_URL}/p-key-get`);
      if (keyResponse.data && keyResponse.data.publicKey) {
        publicKey = keyResponse.data.publicKey;
        // Store in Redux for future use
        const { setServerPublicKey } = await import('@dxc247/shared/store/slices/commonDataSlice');
        store.dispatch(setServerPublicKey(publicKey));
        console.log("✅ Public key fetched and stored in Redux");
      } else {
        throw new Error("Invalid public key response from server");
      }
    } catch (error) {
      console.error("❌ Failed to fetch public key:", error);
      // Fallback to hardcoded key if API fails
      publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA77YBndYGoCtviSV7tc+d
UZAe1BQvkQtvEoPskg6yWLI4WGQGKEpGv9mELDWpq4KS2y0iWAmAuwybVvqoEMHp
408gdlpF5UEq2of3vgnd61weIJs/5ZNVRQjADMYlSd+fa4p0Xa1/OkadcWoAuwDV
QHiaLkIzKwPdvMqWrtFkaMZ+zOpXuJS8UfIQlxRUJ5DVI37+6cBkuYnAEnVtkZlu
sx4dY0tU9uv2T1ShvYcTcFG83cZXfNEknNGMpHQHMCeeZSbksgftDrUgk6rJexrv
VOPavpBJv7gcwP1UAHnmMzTMwYzT8NRNYnq5kD0C7XJU1dN4V5HHOc38KlcLoXdB
MQIDAQAB
-----END PUBLIC KEY-----`;
      console.log("⚠️ Using fallback hardcoded public key");
    }
  } else {
    console.log("🔐 Using cached public key from Redux");
  }

  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);

  const encryptedAESKey = encryptor.encrypt(CryptoJS.enc.Base64.stringify(aesKey));

  // 4️⃣ Build request config
  const requestConfig = {
    method,
    url: import.meta.env.VITE_API_URL +  url,
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Encrypted-Key": encryptedAESKey,
      "X-IV": CryptoJS.enc.Base64.stringify(aesIv),
    },
    data: {},
  };

  // For POST/PUT/PATCH, send encrypted payload in body
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && encryptedPayload) {
    requestConfig.data = {
      payload: encryptedPayload,
    };
  }

  try {
    const response = await axios(requestConfig);

    // 5️⃣ Decrypt backend response if encrypted
    const encryptedResponse = response.data?.data;
    if (encryptedResponse) {
      const decrypted = CryptoJS.AES.decrypt(encryptedResponse, aesKey, {
        iv: aesIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      const decryptedJSON = JSON.parse(decryptedText);

      console.log('decrypted json is ', decryptedJSON);
      return decryptedJSON?.data || decryptedJSON;
    } else {
      return response.data;
    }
  } catch (err) {
    if (err?.error === "Unauthenticated" || err?.response?.status === 401) {
      store.dispatch(adminLogout());
      return null;
    } else if (err?.code === "ERR_NETWORK") {
      return null;
    }
    throw err;
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

