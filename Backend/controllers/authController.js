import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import FarmerProfile from "../models/Farmer.js";
import sequelize from "../db/db.js";


// Signup

export const Signup = async (req, res) => {
    const transaction = await sequelize.transaction();
    const { name, email, password, isFarmer } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({ error: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(
            {
                name,
                email,
                password: hashedPassword,
                isFarmer,
            },
            { transaction }
        );

        const token = generateToken(newUser._id, newUser.isFarmer);

        if (isFarmer) {
            const { farm_location, products_grown } = req.body;

            if (!farm_location || !products_grown) {
                await transaction.rollback();
                return res.status(400).json({ error: "Please provide all the required fields!" });
            }

            await FarmerProfile.create(
                {
                    userId: newUser._id,
                    farm_location,
                    products_grown,
                },
                { transaction }
            );
        }

        // Commit the transaction for both farmer and non-farmer users
        await transaction.commit();

        res.cookie("access-token", token, {
            httpOnly: true,
            maxAge: 3600000,
        });

        res.status(201).json({
            message: "User Registered successfully!",
            user: {
                _id: newUser._id,
                name,
                email,
                isFarmer,
            },
        });
    } catch (error) {
        console.error("Error during signup:", error);

        // Rollback transaction on error
        await transaction.rollback();
        res.status(500).json({ error: "Something went wrong" });
    }
};


// Login

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "User does not exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const token = generateToken(user._id, user.isFarmer);
        res.cookie('access-token', token, {
            httpOnly: true,
            maxAge: 3600000,
        });

        res.status(200).json({
            message: "User Logged in successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isFarmer: user.isFarmer,
            },
        });

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// Logout

export const Logout = async (req, res) => {
    try {
        // Clear the 'access-token' cookie
        res.clearCookie('access-token');

        // Optionally, you can also perform additional cleanup if needed
        // For example, you might want to invalidate the token on the server side
        // if you are using a token blacklist or similar mechanism.

        res.status(200).json({ message: "User logged out successfully!" });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};