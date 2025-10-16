import crypto from "crypto";

const generateToken = (): string => crypto.randomBytes(32).toString("hex");

export default generateToken;
