import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "admin_test@example.com";
        let user = await User.findOne({ email });

        if (!user) {
            console.log("User not found, creating...");
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await User.create({
                name: "Admin Test",
                email,
                password: hashedPassword,
                role: "admin"
            });
            console.log(`User ${email} created as admin`);
        } else {
            // Ensure admin password is bcrypt-hashed in case a legacy plain text value exists.
            if (typeof user.password === "string" && !user.password.startsWith("$2")) {
                user.password = await bcrypt.hash(user.password, 10);
            }
            user.role = "admin";
            await user.save();
            console.log(`User ${email} promoted to admin`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

makeAdmin();
