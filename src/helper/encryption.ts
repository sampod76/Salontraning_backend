import * as crypto from 'crypto';
const algorithm = 'aes-256-cbc'; // Choose an encryption algorithm
const key: Buffer = crypto.randomBytes(32); // Generate a 32-byte key
const iv: Buffer = crypto.randomBytes(16); // Generate a 16-byte IV
export type IEncodedData = {
  userId: string;
  course_id: string;
  amount: {
    currency: string;
    total: string;
  };
};
export const encrypt = (obj: IEncodedData): string => {
  const text: string = JSON.stringify(obj);
  const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted: string = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encryptedText: string): IEncodedData => {
  const decipher: crypto.Decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted: string = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  const obj = JSON.parse(decrypted);
  return obj;
};
