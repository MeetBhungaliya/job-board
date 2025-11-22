import { Router } from "express";
import importRoutes from "./import.route";
import healthRoutes from "./health.route";
import analyticsRoutes from "./analytics.route";
import eventsRoutes from "./events.route";

const router = Router();

router.use("/health", healthRoutes);
router.use("/imports", importRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/events", eventsRoutes);

export default router;
