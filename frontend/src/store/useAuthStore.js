import axios from "axios";
import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast"
import { LogOut } from "lucide-react";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSignupUp: false,
    isLoggingIng: false,
    isUpdatingprofile: false,
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data})
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({authUser:null})
            
        }finally{
            set({isCheckingAuth : false});
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isSigningUp: false });
        }
      
      

    }

    Logout: async () =>{
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser: null});
        toast.success("Logged out successfully");

      } catch (error) {
        toast.error(error.response.data.message);
        
      }
    }
}));