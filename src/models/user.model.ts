import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    authProvider:
        | "local"
        | "google"
        | "github"
        | "linkedin"
        | "facebook"
        | "twitter"
        | "apple"
        | "microsoft";
    role: "USER" | "ADMIN";
    refreshToken?: string;
    otpSignup?: string;
    otpSignupExpiry?: Date;
    isVerified: boolean;
    forgetPasswordToken?: string;
    forgetPasswordExpiry?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "firstname is required"],
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        avatar: {
            public_id: { type: String },
            url: { type: String },
        },
        authProvider: {
            type: String,
            enum: [
                "local",
                "google",
                "github",
                "linkedin",
                "facebook",
                "twitter",
                "apple",
                "microsoft",
            ],
            default: "local",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
        refreshToken: {
            type: String,
        },
        otpSignup: {
            type: String,
        },
        otpSignupExpiry: {
            type: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        forgetPasswordToken: {
            type: String,
        },
        forgetPasswordExpiry: {
            type: Date,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (err: any) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User = model<IUser>("Auth", userSchema);

export default User;
