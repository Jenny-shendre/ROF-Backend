import express from "express";
import { changePassword, createAdmin, deleteAdmin, deleteAllAdmins, forgotPassword, loginUser, setNewPassword, updateAdmin, verifyOtp } from "../Controllers/adminController.js";
import { verifyTokenAndRole } from "../Middlewares/loginMiddleware.js";


const router = express.Router();

router.post("/save", createAdmin);
router.post("/login", loginUser);
router.post("/forget-pass", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setNewPassword);
router.post("/change-password", changePassword);


router.put('/update/:id', updateAdmin);
router.delete('/delete/:id', deleteAdmin);
router.delete('/delete-all', deleteAllAdmins);


router.get('/dashboard/super-admin', verifyTokenAndRole('super admin'), (req, res) => res.send("Super Admin Dashboard"));
router.get('/dashboard/sales-executive', verifyTokenAndRole('sales executive'), (req, res) => res.send("Sales Executive Dashboard"));
router.get('/dashboard/manager', verifyTokenAndRole('manager'), (req, res) => res.send("Manager Dashboard"));



export default router;
