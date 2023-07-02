"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const moderator_controller_1 = require("./moderator.controller");
const moderator_validations_1 = require("./moderator.validations");
const router = express_1.default.Router();
router
    .route('/')
    .post(moderator_controller_1.ModeratorController.createModerator)
    .get(moderator_controller_1.ModeratorController.getAllModerators);
router
    .route('/:id')
    .get(moderator_controller_1.ModeratorController.getSingleModerator)
    .patch((0, validateRequestZod_1.default)(moderator_validations_1.ModeratorValidation.updateModeratorZodSchema), moderator_controller_1.ModeratorController.updateModerator)
    .delete(moderator_controller_1.ModeratorController.deleteModerator);
exports.ModeratorRoutes = router;
