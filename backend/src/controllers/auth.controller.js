import { generateToken } from "../lib/utiles.js";
import User  from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();  // Save user before generating token

        generateToken(newUser._id, res);  // Generate token after saving user

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req,res) =>{

    const { email,password}= req.body 
   try {
    const user = await User.findOne ({email})

    if(!user){
        return res.status(400).json({message:"Invalid credentails"})
    }
    const isPasswordCorrect=await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentails"});
    }

    generateToken(user._id,res)

    res.status(200).json({
        _id:user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic:user.profilePic,
    })


     } catch (error) {

    console.log("Error in login controller", error.message);
    res.status(500).json({ message:"Interanl Server  Error "});
  }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });  // Clear JWT cookie
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        
        // Update user profile
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        
        res.status(200).json(updateUser);
    } catch (error) {
        console.log("Error in update profile:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error  in  checkAuth controller", error.message);
        res.status(500).json({message:"Internal  Server  Error"});
         
        
    }
}