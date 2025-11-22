import { Router } from "express";
import { triggerManualImport, listImportLogs } from "../controllers/import.controller";

const router = Router();

router.post("/run", triggerManualImport);
router.get("/logs", listImportLogs);

export default router;
