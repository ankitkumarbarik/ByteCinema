import crypto from "crypto";

const generateOtp = (): string =>
    crypto.randomInt(100000, 999999).toString();

export default generateOtp;
