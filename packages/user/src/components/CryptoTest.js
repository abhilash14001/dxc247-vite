import React, { useEffect } from 'react';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import axios from 'axios';

const CryptoTest = () => {
  useEffect(() => {
    async function encryptData() {
      try {
        // 1️⃣ Generate AES Key (32 bytes) and IV (16 bytes)
        const aesKey = CryptoJS.lib.WordArray.random(32);
        const aesIv = CryptoJS.lib.WordArray.random(16);

        // 2️⃣ Prepare data to encrypt
        const data = { plainText: 'Hello, world!' };
        const jsonData = JSON.stringify(data);

        // 3️⃣ Encrypt payload using AES
        const encryptedPayload = CryptoJS.AES.encrypt(jsonData, aesKey, {
          iv: aesIv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();

        // 4️⃣ Encrypt AES key using server public RSA key
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----
          MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA77YBndYGoCtviSV7tc+d
          UZAe1BQvkQtvEoPskg6yWLI4WGQGKEpGv9mELDWpq4KS2y0iWAmAuwybVvqoEMHp
          408gdlpF5UEq2of3vgnd61weIJs/5ZNVRQjADMYlSd+fa4p0Xa1/OkadcWoAuwDV
          QHiaLkIzKwPdvMqWrtFkaMZ+zOpXuJS8UfIQlxRUJ5DVI37+6cBkuYnAEnVtkZlu
          sx4dY0tU9uv2T1ShvYcTcFG83cZXfNEknNGMpHQHMCeeZSbksgftDrUgk6rJexrv
          VOPavpBJv7gcwP1UAHnmMzTMwYzT8NRNYnq5kD0C7XJU1dN4V5HHOc38KlcLoXdB
          MQIDAQAB
          -----END PUBLIC KEY-----`);

        const encryptedAESKey = encryptor.encrypt(CryptoJS.enc.Base64.stringify(aesKey));
        const params = new URLSearchParams();
        params.append('encryptedKey', encryptedAESKey);
        params.append('iv', CryptoJS.enc.Base64.stringify(aesIv));
        
        // 5️⃣ Send request to server
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/test-api`, {
          encryptedKey: encryptedAESKey,
          iv: CryptoJS.enc.Base64.stringify(aesIv),
          payload: encryptedPayload,
        });

        console.log('Server Response:', response.data);

        // 6️⃣ Decrypt backend response using SAME AES key & IV
        const encryptedResponse = response.data.data; // Only encryptedData returned
        if (encryptedResponse) {
          const decrypted = CryptoJS.AES.decrypt(encryptedResponse, aesKey, {
            iv: aesIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });

          const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
          
        }
      } catch (error) {
        console.error('❌ Error:', error);
      }
    }

    encryptData();
  }, []);

  return <div>🔒 Encryption Test Running...</div>;
};

export default CryptoTest;
