"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralUserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const controller_GeneralUser_1 = require("./controller.GeneralUser");
const validation_GeneralUser_1 = require("./validation.GeneralUser");
const router = express_1.default.Router();
router
    .route('/')
    .get(controller_GeneralUser_1.GeneralUserController.getAllGeneralUsers)
    // sign up user
    .post((0, validateRequestZod_1.default)(validation_GeneralUser_1.GeneralUserValidation.createGeneralUserByFirebaseZodSchema), controller_GeneralUser_1.GeneralUserController.createGeneralUserByFirebase);
router
    .route('/get-course/:id')
    .get(controller_GeneralUser_1.GeneralUserController.getSingleGeneralUserToCourse);
router
    .route('/update-course-quiz/:id')
    .patch(controller_GeneralUser_1.GeneralUserController.updateCourseVedioOrQuiz);
router
    .route('/:id')
    .get(controller_GeneralUser_1.GeneralUserController.getSingleGeneralUser)
    .delete(controller_GeneralUser_1.GeneralUserController.deleteGeneralUser)
    .patch((0, validateRequestZod_1.default)(validation_GeneralUser_1.GeneralUserValidation.updateGeneralUserZodSchema), controller_GeneralUser_1.GeneralUserController.updateGeneralUser);
exports.GeneralUserRoutes = router;
