import { Router } from "express";
import importRoutes from "./import.route";
import healthRoutes from "./health.route";

const router = Router();

router.use("/health", healthRoutes);
router.use("/imports", importRoutes);

export default router;
