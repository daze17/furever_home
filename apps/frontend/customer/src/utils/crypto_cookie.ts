//
import crypto from "crypto-js";

export const encrypt = (value: string, secret: string) => {
  const result = crypto.AES.encrypt(value, secret);

  return result.toString();
};
export const decrypt = (value: string, secret: string) => {
  const result = crypto.AES.decrypt(value, secret);

  return result.toString(crypto.enc.Utf8);
};
