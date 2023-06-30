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
exports.Purchased_coursesService = void 0;
const paginationHelper_1 = require("../../../helper/paginationHelper");
const purchased_courses_consent_1 = require("./purchased_courses.consent");
const purchased_courses_model_1 = require("./purchased_courses.model");
const createPurchased_coursesByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield purchased_courses_model_1.Purchased_courses.create(payload)).populate({
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
//getAllPurchased_coursesFromDb
const getAllPurchased_coursesFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: purchased_courses_consent_1.PURCHASED_COURSES_SEARCHABLE_FIELDS.map(field => ({
                [field]: new RegExp(searchTerm, 'i'),
            })),
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
    const result = yield purchased_courses_model_1.Purchased_courses.find(whereConditions)
        .sort(sortConditions)
        .skip(Number(skip))
        .limit(Number(limit));
    const total = yield purchased_courses_model_1.Purchased_courses.countDocuments(whereConditions);
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
const getSinglePurchased_coursesFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchased_courses_model_1.Purchased_courses.findById(id);
    return result;
});
// update e form db
const updatePurchased_coursesFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchased_courses_model_1.Purchased_courses.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// delete e form db
const deletePurchased_coursesByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchased_courses_model_1.Purchased_courses.findByIdAndDelete(id);
    return result;
});
exports.Purchased_coursesService = {
    createPurchased_coursesByDb,
    getAllPurchased_coursesFromDb,
    getSinglePurchased_coursesFromDb,
    updatePurchased_coursesFromDb,
    deletePurchased_coursesByIdFromDb,
};
