import { Router } from "express";
import { importsEventStream } from "../controllers/events.controller";

const router = Router();

router.get("/imports", importsEventStream);

export default router;
