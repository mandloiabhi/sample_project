import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerJobSeeker } from "../controllers/user.controller.js";
import { registerJobPoster } from "../controllers/user.controller.js";
import { createJob } from "../controllers/user.controller.js";
import { availableJobs } from "../controllers/user.controller.js";
const router= Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/jobseeker").post(verifyJWT,registerJobSeeker)
router.route("/jobposter").post(verifyJWT,registerJobPoster)
router.route("/createJob").post(verifyJWT,createJob);
router.route("/availableJobs").post(verifyJWT,availableJobs)
export default router;