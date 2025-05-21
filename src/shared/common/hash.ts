import { createHash } from "node:crypto";
import appConfig from "./config";

function sha256(content: string) {
  return createHash("sha3-256").update(content).digest("hex");
}

function hashPassword(password: string) {
  return sha256(`${password}${appConfig.app.hashPasswordKey}`);
}

function hashRole(role: string) {
  return sha256(`${role}${appConfig.app.hashRoleKey}`);
}

export { sha256, hashPassword, hashRole };
