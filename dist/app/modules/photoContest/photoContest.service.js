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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoContestUserService = void 0;
const paginationHelper_1 = require("../../../helper/paginationHelper");
const photoContest_model_1 = require("./photoContest.model");
const photoContest_consent_1 = require("./photoContest.consent");
const users_1 = require("../../../enums/users");
const createPhotoContestUserByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield photoContest_model_1.PhotoContestUser.create(payload)).populate({
        path: 'course',
        // select: { needsPasswordChange: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        // populate: [
        //   {
        //     path: 'moderator',
        //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
        //   }
        // ],
    });
    return result;
});
//getAllPhotoContestUserFromDb
const getAllPhotoContestUserFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: photoContest_consent_1.PHOTOCONTEST_USER_SEARCHABLE_FIELDS.map(field => 
            //search array value
            field === 'tag'
                ? { [field]: { $in: new RegExp(searchTerm, 'i') } }
                : {
                    [field]: new RegExp(searchTerm, 'i'),
                }),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    //****************search and filters end**********/
    //****************pagination start **************/
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield photoContest_model_1.PhotoContestUser.find(whereConditions)
        .sort(sortConditions)
        .skip(Number(skip))
        .limit(Number(limit));
    const total = yield photoContest_model_1.PhotoContestUser.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single e form db
const getSinglePhotoContestUserFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield photoContest_model_1.PhotoContestUser.findById(id);
    return result;
});
// update e form db
const updatePhotoContestUserFromDb = (id, req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const quary = {
        _id: id,
    };
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== users_1.ENUM_USER_ROLE.ADMIN) {
        quary.userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
    }
    const result = yield photoContest_model_1.PhotoContestUser.findOneAndUpdate(quary, payload, {
        new: true,
    });
    return result;
});
// delete e form db
const deletePhotoContestUserByIdFromDb = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const quary = {
        _id: id,
    };
    if (((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role) !== users_1.ENUM_USER_ROLE.ADMIN) {
        quary.userId = (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d._id;
    }
    const result = yield photoContest_model_1.PhotoContestUser.findOneAndDelete(quary);
    return result;
});
exports.PhotoContestUserService = {
    createPhotoContestUserByDb,
    getAllPhotoContestUserFromDb,
    getSinglePhotoContestUserFromDb,
    updatePhotoContestUserFromDb,
    deletePhotoContestUserByIdFromDb,
};
