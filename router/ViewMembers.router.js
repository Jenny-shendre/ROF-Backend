import { Router } from "express";
import { ViewMembers, ViewMembersDelete } from "../Controllers/ViewMembers.js";

const router = Router();

router.get("/ViewMembers", ViewMembers);
router.delete("/ViewMembersDelete/:id", ViewMembersDelete);
// router.put("/timeResponse/:customerId", timeResponse);

export default router;
