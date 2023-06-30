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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const users_model_1 = require("../users/users.model");
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const loginUserFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield users_model_1.User.isUserExist(email === null || email === void 0 ? void 0 : email.toLowerCase());
    //chack user
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //match password
    if (!(yield users_model_1.User.isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUserByUidFromDb = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield model_GeneralUser_1.GeneralUser.findOne({ uid: uid });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        name: isUserExist.name,
        _id: isUserExist._id,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        _id: isUserExist._id,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    //chack this user exist database
    const isUserExist = yield users_model_1.User.isUserExist(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ email: isUserExist.email, role: isUserExist.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AuthService = {
    loginUserFromDb,
    loginUserByUidFromDb,
    refreshToken,
};
