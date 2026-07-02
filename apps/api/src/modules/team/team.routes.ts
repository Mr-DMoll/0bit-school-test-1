import { Router } from "express";
import { listTeam, inviteTeamMember, removeTeamMember } from "./team.controller.js";
import { protect }   from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { Role }      from "@repo/types";

const router = Router();

router.use(protect, authorize([Role.ADMIN]));
router.get("/",           listTeam);
router.post("/invite",    inviteTeamMember);
router.delete("/:id",     removeTeamMember);

export default router;
