import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
import { store } from "../store";

/**
 * Hybrid encrypt a JS object for sending to Node.js backend
 * @param {Object} data - payload
 * @returns {Object} { payload, encryptedKey, iv } (all Base64)
 */
export default function encryptHybrid(data) {
  // 1️⃣ Generate random AES key & IV
  const aesKey = CryptoJS.lib.WordArray.random(32); // 256-bit AES
  const aesIv = CryptoJS.lib.WordArray.random(16);  // 16-byte IV

  // 2️⃣ Encrypt payload using AES-256-CBC
  const jsonData = JSON.stringify(data);
  const encryptedPayload = CryptoJS.AES.encrypt(jsonData, aesKey, {
    iv: aesIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(); // Base64 ciphertext

  // 3️⃣ Encrypt AES key with server public key using JSEncrypt
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(store.getState().commonData.serverPublicKey);

  const aesKeyBase64 = CryptoJS.enc.Base64.stringify(aesKey); // Convert WordArray to Base64
  const encryptedKey = encryptor.encrypt(aesKeyBase64);        // RSA-encrypted AES key

  // 4️⃣ Return object with Base64 values
  return {
    payload: encryptedPayload,       // AES ciphertext
    encryptedKey: encryptedKey,      // RSA-encrypted AES key
    iv: CryptoJS.enc.Base64.stringify(aesIv), // IV
  };
}
