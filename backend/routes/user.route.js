import express from "express";


import { 
    login, 
    logout, 
    register, 
    updateProfile,
    getProfile // Added this new controller
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js"; // Fixed typo in "multer"
import { validateRegistration, validateLogin, validateProfileUpdate } from "../middlewares/validation.js"; // Added validation middleware

const router = express.Router();

// Registration route
router.post("/register", validateRegistration, singleUpload, register);

// Login route
router.post("/login", validateLogin, login);

// Logout route
router.get("/logout", isAuthenticated, logout);

// Update profile route
router.put("/profile", isAuthenticated, validateProfileUpdate, singleUpload, updateProfile);

// Get profile route (new)
router.get("/profile", isAuthenticated, getProfile);

export default router;