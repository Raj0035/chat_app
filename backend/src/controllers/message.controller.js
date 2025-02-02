import User from "../models/user.model.js";

export const getUsersForSidebar = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-passwaord");

        res.status(200).json()
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message); 
        res.status(500).json({error: "Internal server  error"});
         
        
    }
};
  
export const getMessages = async (req,res) => {
    try{
      const =req.params   
    } catch (error){

    }
}