"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadeRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const constroller_fileUploade_1 = require("./constroller.fileUploade");
const validation_fileUploade_1 = require("./validation.fileUploade");
const router = express_1.default.Router();
router
    .route('/')
    .get(constroller_fileUploade_1.FileUploadeController.getAllFileUploade)
    .post((0, validateRequestZod_1.default)(validation_fileUploade_1.FileUploadeValidation.createFileUploadezodSchema), constroller_fileUploade_1.FileUploadeController.createFileUploade);
router
    .route('/:id')
    .get(constroller_fileUploade_1.FileUploadeController.getSingleFileUploade)
    .patch((0, validateRequestZod_1.default)(validation_fileUploade_1.FileUploadeValidation.updateFileUploadezodSchema), constroller_fileUploade_1.FileUploadeController.updateFileUploade)
    .delete(constroller_fileUploade_1.FileUploadeController.deleteFileUploade);
exports.FileUploadeRoute = router;
