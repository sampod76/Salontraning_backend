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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const users_1 = require("../../enums/users");
const jwtHelpers_1 = require("../../helper/jwtHelpers");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const authMiddleware = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get authorization token
        const token = req.headers.authorization;
        const tokenCookie = req.cookies.refreshToken;
        console.log(token, tokenCookie);
        // if (!tokenCookie) {
        //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized ');
        // }
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized ');
        }
        // verify token
        let verifiedUser = null;
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        // if (tokenCookie) {
        // verifiedUser = jwtHelpers.verifyToken(
        //   tokenCookie,
        //   config.jwt.refresh_secret as Secret
        // );
        // }
        //রিকুয়েস্ট টার মধ্যে আমরা কোন কিছু টাইপি স্ক্রিপ্ট এর কারণে সরাসরি এড করতে পারবো না | তার জন্য আমাদেরকে index.d.ts --> interface a এই নামে একটা ফাইল বানাতে হবে
        // {role,email}
        if (!(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role)) {
            verifiedUser.role = users_1.ENUM_USER_ROLE.GENERAL_USER;
        }
        req.user = verifiedUser;
        // role diye guard korar jnno
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role)) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden access');
        }
        //chack token user
        // if (
        //   !(await User.isUserExist(verifiedUser?.email)) &&
        //   !(await GeneralUser.findOne({ uid: verifiedUser?.uid }))
        // ) {
        //   throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
        // }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = authMiddleware;
