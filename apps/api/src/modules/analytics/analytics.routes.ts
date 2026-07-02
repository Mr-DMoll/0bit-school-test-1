import { Router } from "express";
import { trackPageView, getSummary } from "./analytics.controller.js";
import { protect }   from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { Role }      from "@repo/types";

const router = Router();

// Public — fired as a beacon from the public site, no auth
router.post("/track", trackPageView);

router.get("/summary", protect, authorize([Role.ADMIN, Role.MANAGER]), getSummary);

export default router;
