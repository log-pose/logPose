import config from "../config/env"
import * as crypto from "crypto";

export default class Encrypter {
    static algorithm = config.hashAlg;
    static key = crypto.scryptSync(config.hashSecret, "salt", 32);

    static encrypt(clearText :string) {
        const iv = crypto.randomBytes(16);
        try {
            const cipher = crypto.createCipheriv(
                Encrypter.algorithm,
                Encrypter.key,
                iv
            );
            const encrypted = cipher.update(clearText, "utf8", "hex");
            return [
                encrypted + cipher.final("hex"),
                Buffer.from(iv).toString("hex"),
            ].join("|");
        } catch (error) {
            return error;
        }
    }

    static decrypt(encryptedText :string) {
        try {
            const [encrypted, iv] = encryptedText.split("|");
            if (!iv) throw new Error("IV not found");
            const decipher = crypto.createDecipheriv(
                Encrypter.algorithm,
                Encrypter.key,
                Buffer.from(iv, "hex")
            );
            return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
        } catch (error) {
            return error;
        }
    }
}