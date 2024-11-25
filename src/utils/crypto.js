import { createCipheriv, createDecipheriv } from "crypto";

const key = process.env.ENCRYPTION_KEY; 
const iv = Buffer.alloc(16, 0); 

const encrypt = (text) => {
  if (!key) {
    throw new Error("Chave de criptografia não configurada.");
  }

  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (encryptedText) => {
  if (!key) {
    throw new Error("Chave de criptografia não configurada.");
  }

  const decipher = createDecipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { encrypt, decrypt };
