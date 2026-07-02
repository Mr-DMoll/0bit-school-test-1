import { Router } from "express";
import { listAuditLogs } from "./audit.controller.js";
import { protect }   from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { Role }      from "@repo/types";

const router = Router();

router.get("/", protect, authorize([Role.ADMIN]), listAuditLogs);

export default router;
