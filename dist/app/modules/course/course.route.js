"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const course_constroller_1 = require("./course.constroller");
const course_validation_1 = require("./course.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(course_constroller_1.CourseController.getAllCourse)
    .post((0, validateRequestZod_1.default)(course_validation_1.CourseValidation.createCourseZodSchema), course_constroller_1.CourseController.createCourse);
router
    .route('/:id')
    .get(course_constroller_1.CourseController.getSingleCourse)
    .patch((0, validateRequestZod_1.default)(course_validation_1.CourseValidation.updateCourseZodSchema), course_constroller_1.CourseController.updateCourse)
    .delete(course_constroller_1.CourseController.deleteCourse);
exports.CourseRoute = router;
