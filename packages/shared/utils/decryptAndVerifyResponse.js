import CryptoJS from "crypto-js";
import forge from "node-forge";
import { store } from "../store";
/**
 * Decrypt AES-encrypted backend response and verify signature
 * @param {Object} encryptedObj - { payload, iv, signature, aesKey }
 * @param {string} serverPublicKeyPem - Backend public key (PEM format)
 * @returns {Object} Decrypted JS object
 */
export function decryptAndVerifyResponse(encryptedObj) {
  const { payload, iv, signature, aesKey } = encryptedObj;

  const serverPublicKeyPem = store.getState().commonData.serverPublicKey;
  // 1️⃣ Convert AES key & IV from Base64 to WordArray
  const aesKeyWA = CryptoJS.enc.Base64.parse(aesKey);
  const aesIvWA = CryptoJS.enc.Base64.parse(iv);

  // 2️⃣ AES decrypt payload
  const decrypted = CryptoJS.AES.decrypt(payload, aesKeyWA, {
    iv: aesIvWA,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  // 3️⃣ Verify signature
  const serverPublicKey = forge.pki.publicKeyFromPem(serverPublicKeyPem);
  const md = forge.md.sha256.create();
  md.update(payload, "utf8");
  const signatureBytes = forge.util.decode64(signature);

  const isValid = serverPublicKey.verify(md.digest().bytes(), signatureBytes);
  if (!isValid) throw new Error("Response signature invalid!");

  return JSON.parse(decryptedText);
}
