import { Router } from "express";
import { pingController } from "../controllers/pingController.js";

const router = Router();

// Phase 3.1: Success ping
router.get('/:token', pingController.pingSuccess);

export default router;
