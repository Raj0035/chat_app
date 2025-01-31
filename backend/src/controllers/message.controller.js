import User from "../models/user.model.js"

export const getUsersForSidebar = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-passwaord");

        res.status(200).json()
    } catch (error) {
        
    }
}