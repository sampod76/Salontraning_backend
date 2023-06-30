"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchased_coursesRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const purchased_courses_constroller_1 = require("./purchased_courses.constroller");
const purchased_courses_validation_1 = require("./purchased_courses.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(purchased_courses_constroller_1.Purchased_coursesController.getAllPurchased_courses)
    .post((0, validateRequestZod_1.default)(purchased_courses_validation_1.PurchasedCoursesValidation.cteateZodPurchasedCoursesSchema), purchased_courses_constroller_1.Purchased_coursesController.createPurchased_courses);
router
    .route('/:id')
    .get(purchased_courses_constroller_1.Purchased_coursesController.getSinglePurchased_courses)
    .patch((0, validateRequestZod_1.default)(purchased_courses_validation_1.PurchasedCoursesValidation.updateZodPurchasedCoursesSchema), purchased_courses_constroller_1.Purchased_coursesController.updatePurchased_courses)
    .delete(purchased_courses_constroller_1.Purchased_coursesController.deletePurchased_courses);
exports.Purchased_coursesRoute = router;
