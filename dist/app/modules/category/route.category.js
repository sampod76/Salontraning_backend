"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const constroller_category_1 = require("./constroller.category");
const validation_category_1 = require("./validation.category");
const router = express_1.default.Router();
router
    .route('/')
    .get(constroller_category_1.CategoryController.getAllCategory)
    .post((0, validateRequestZod_1.default)(validation_category_1.CategoryValidation.createCategoryZodSchema), constroller_category_1.CategoryController.createCategory);
router
    .route('/:id')
    .get(constroller_category_1.CategoryController.getSingleCategory)
    .patch((0, validateRequestZod_1.default)(validation_category_1.CategoryValidation.updateCategoryZodSchema), constroller_category_1.CategoryController.updateCategory)
    .delete(constroller_category_1.CategoryController.deleteCategory);
exports.CategoryRoute = router;
