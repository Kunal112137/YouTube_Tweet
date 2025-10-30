import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";
import {Route} from "react-router-dom";

const router=Router();
router.route('/').get(healthcheck);
export default router