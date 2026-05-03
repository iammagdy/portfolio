import { Router, type IRouter } from "express";
import healthRouter from "./health";
import devkitRouter from "./devkit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(devkitRouter);

export default router;
