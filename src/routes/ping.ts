import { Router } from "express";
import { pingController } from "../controllers/pingController.js";

const router = Router();

// Phase 3.1: Success ping
router.get('/:token', pingController.pingSuccess);

// Phase 3.2: Start ping
router.get('/:token/start', pingController.pingStart);

// Phase 3.3: Fail ping
router.get('/:token/fail', pingController.pingFail);

export default router;
