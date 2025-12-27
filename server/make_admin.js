import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "admin_test@example.com";
        let user = await User.findOne({ email });

        if (!user) {
            console.log("User not found, creating...");
            user = await User.create({
                name: "Admin Test",
                email,
                password: "password123",
                role: "admin"
            });
            console.log(`User ${email} created as admin`);
        } else {
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
