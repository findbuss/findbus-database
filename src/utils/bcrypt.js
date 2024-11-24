import { createCipher, createDecipher } from "crypto";

const encrypt = (text) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Chave de criptografia não configurada.");
  }
  const cipher = createCipher("aes-256-cbc", key);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (encryptedText) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Chave de criptografia não configurada.");
  }
  const decipher = createDecipher("aes-256-cbc", key);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { decrypt, encrypt };
