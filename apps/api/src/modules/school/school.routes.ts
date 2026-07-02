import { Router } from "express";
import { getSchool, updateSchool } from "./school.controller.js";
import { protect }   from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { Role }      from "@repo/types";

const router = Router();

// Public — the public site needs this without auth
router.get("/", getSchool);

// Admin or Manager — the controller enforces field-level authorization
// (Branding fields are Admin-only; Manager can edit Site Content fields).
router.patch("/", protect, authorize([Role.ADMIN, Role.MANAGER]), updateSchool);

export default router;
