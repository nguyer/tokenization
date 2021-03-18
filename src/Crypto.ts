import fs from "fs";
import crypto from "crypto";
// AES-256-GCM encryption using a pre-computed key and random IV

export default class Crypto {
  private key: string;

  constructor() {
    if (fs.existsSync("key")) {
      this.key = this.readKey();
    } else {
      this.key = this.generateNewKey();
    }
  }

  private readKey() {
    return fs.readFileSync("key", { encoding: "utf-8" });
  }

  private generateNewKey() {
    const key = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync("key", key);
    return key;
  }

  public encrypt(plaintext: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      Buffer.from(this.key, "hex"),
      iv
    );
    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString("hex");
  }
  public decrypt(ciphertext: string) {
    const data = Buffer.from(ciphertext, "hex");
    const iv = data.slice(0, 16);
    const tag = data.slice(16, 32);
    const text = data.slice(32);
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(this.key, "hex"),
      iv
    );
    decipher.setAuthTag(tag);
    return decipher.update(text) + decipher.final("utf8");
  }

  public generateToken() {
    return crypto.randomBytes(16).toString("hex");
  }
}
