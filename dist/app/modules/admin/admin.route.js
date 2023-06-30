"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const admin_controller_1 = require("./admin.controller");
const admin_validations_1 = require("./admin.validations");
const router = express_1.default.Router();
router.route('/').get(admin_controller_1.AdminController.getAllAdmins);
router
    .route('/:id')
    .get(admin_controller_1.AdminController.getSingleAdmin)
    .patch((0, validateRequestZod_1.default)(admin_validations_1.AdminValidation.updateAdminZodSchema), admin_controller_1.AdminController.updateAdmin)
    .delete(admin_controller_1.AdminController.deleteAdmin);
exports.AdminRoutes = router;
