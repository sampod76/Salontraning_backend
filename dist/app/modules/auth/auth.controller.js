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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const auth_service_1 = require("./auth.service");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { uid } = _a, payload = __rest(_a, ["uid"]);
    let result = null;
    if (uid) {
        result = yield auth_service_1.AuthService.loginUserByUidFromDb(uid);
    }
    else {
        result = yield auth_service_1.AuthService.loginUserFromDb(payload);
    }
    const { refreshToken } = result, othersData = __rest(result, ["refreshToken"]);
    // console.log(req.cookies, 13);
    // set refresh token into cookie
    const cookieOptions = {
        // secure: config.env === 'production' ? true :false,
        //same
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', othersData.accessToken, cookieOptions);
    //set refre
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'successfull login',
        data: othersData,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token does not found');
    }
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    const cookieOptions = {
        // secure: config.env === 'production' ? true :false,
        //same
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
    res.cookie('refreshToken', refreshToken, cookieOptions);
    //set refre
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'successfull login',
        data: result,
    });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
};
