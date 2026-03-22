import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
import controllers from "../controllers/user.controllers.js";

router.post("/register", controllers.registeruser);
router.post("/login", controllers.login);
router.post("/logout", controllers.logout);
router.post("/refresh-token", controllers.refreshToken);
router.get("/profile", protectRoute, controllers.profile);
router.get("/test", protectRoute, controllers.testing_token);


export default router;
