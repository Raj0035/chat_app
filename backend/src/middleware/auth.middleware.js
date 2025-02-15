import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from the cookies
        const token = req.cookies.jwt;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if decoded token exists
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid or Expired Token" });
        }

        // Find the user by userId from the decoded token
        const user = await User.findById(decoded.userId).select("-password");

        // If the user doesn't exist
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user to the request object
        req.user = user;

        // Move to the next middleware or route handler
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware:", error);  // More detailed error logging

        // Check if error is due to token expiration
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token Expired" });
        }

        // General error handling
        res.status(500).json({ message: "Internal server error" });
    }
};
