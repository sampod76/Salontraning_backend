"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constant/pagination");
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const pick_1 = __importDefault(require("../../share/pick"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const consent_notification_1 = require("./consent.notification");
const sendPush_notification_1 = require("./sendPush.notification");
const service_notification_1 = require("./service.notification");
// import { z } from 'zod'
const createNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const NotificationData = __rest(req.body, []);
    const result = (yield service_notification_1.NotificationService.createNotificationByDb(NotificationData));
    // console.log(req.body.users)
    let fcm_tokens = [];
    if (!((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.fcm_tokens) === null || _b === void 0 ? void 0 : _b.length)) {
        const datas = yield model_GeneralUser_1.GeneralUser.find({
            _id: { $in: req.body.users },
        }).select({ fcm_token: 1, _id: 0 });
        // console.log(datas)
        if (datas.length) {
            datas.forEach(data => {
                if (data === null || data === void 0 ? void 0 : data.fcm_token) {
                    fcm_tokens.push(data.fcm_token);
                }
            });
        }
    }
    else {
        fcm_tokens = (_c = req.body) === null || _c === void 0 ? void 0 : _c.fcm_tokens;
    }
    // console.log(fcm_tokens)
    (0, sendPush_notification_1.sendNotificationsToUsers)(fcm_tokens, Object.assign(Object.assign({}, NotificationData), { id: result._id.toString() }));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull create Notification',
        data: result,
    });
}));
const getAllNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)));
    const filters = (0, pick_1.default)(queryObject, consent_notification_1.NOTIFICATION_FILTERABLE_FIELDS);
    //****************pagination start************ */
    const paginationOptions = (0, pick_1.default)(queryObject, pagination_1.PAGINATION_FIELDS);
    const result = yield service_notification_1.NotificationService.getAllNotificationFromDb(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull Get Notification',
        meta: result.meta,
        data: result.data,
    });
    // next();
}));
const getSingleNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */
    const result = yield service_notification_1.NotificationService.getSingleNotificationFromDb(id);
    /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull get Notification',
        data: result,
    });
}));
const updateNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    /*   if (!globalImport.ObjectId.isValid(id)) {
        throw new ApiError(400, 'invalid id sampod');
      } */
    const result = yield service_notification_1.NotificationService.updateNotificationFromDb(id, updateData);
    /* if (!result) {
        throw new ApiError(400, 'No data found');
      } */
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull update Notification',
        data: result,
    });
}));
const deleteNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield service_notification_1.NotificationService.deleteNotificationByIdFromDb(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull delete Notification',
        data: result,
    });
}));
exports.NotificationController = {
    createNotification,
    getAllNotification,
    getSingleNotification,
    updateNotification,
    deleteNotification,
};
