import { Router } from "express";
import { jobsController } from "../controllers/jobsController.js";
const router = Router();
router.post('/', jobsController.createJob);
router.get('/', jobsController.getJobs);
router.get('/:id', jobsController.getJobById);
router.delete('/:id', jobsController.deleteJob);
router.patch('/:id', jobsController.updateJob);
export default router;
