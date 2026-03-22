import express from "express";
import user from "./user.routes.js";
const router = express.Router();

router.use("/api/auth", user);

export default router;
