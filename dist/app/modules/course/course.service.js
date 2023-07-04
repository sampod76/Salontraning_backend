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
exports.CourseService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const course_consent_1 = require("./course.consent");
const course_model_1 = require("./course.model");
const course_utils_1 = require("./course.utils");
const { ObjectId } = mongoose_1.default.Types;
const createCourseByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.courseId = yield (0, course_utils_1.generateCourseId)();
    const result = (yield course_model_1.Course.create(payload)).populate({
        path: 'publisher',
        select: { needsPasswordChange: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        populate: [
            {
                path: 'moderator',
                select: { createdAt: 0, updatedAt: 0, __v: 0 },
            },
            {
                path: 'admin',
                select: { createdAt: 0, updatedAt: 0, __v: 0 },
            },
        ],
    });
    return result;
});
//getAllCourseFromDb
const getAllCourseFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: course_consent_1.COURSE_SEARCHABLE_FIELDS.map(field => 
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
            $and: Object.entries(filtersData).map(([field, value]) => field === 'price'
                ? { [field]: { $gte: parseInt(value) } }
                : {
                    [field]: value,
                }),
        });
    }
    //****************search and filters end**********/
    //****************pagination start **************/
    // const { page, limit, skip, sortBy, sortOrder } =
    //   paginationHelper.calculatePagination(paginationOptions);
    // const sortConditions: { [key: string]: SortOrder } = {};
    // if (sortBy && sortOrder) {
    //   sortConditions[sortBy] = sortOrder;
    // }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    /*
    const result = await Course.find(whereConditions)
      .sort(sortConditions)
      .skip(Number(skip))
      .limit(Number(limit));
    */
    const pipeline = [
        { $match: whereConditions },
        // {
        //   $lookup: {
        //     from: 'lessions',
        //     localField: 'courseId',
        //     foreignField: 'courseId',
        //     as: 'All_lessions',
        //   },
        // },
        {
            $lookup: {
                from: 'moderators',
                let: { id: '$publisher' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$id'] },
                            // Additional filter conditions for collection2
                        },
                    },
                    // Additional stages for collection2
                    // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            profileImage: 1,
                        },
                    },
                ],
                as: 'publisherDetails',
            },
        },
        { $sort: sortConditions },
        { $skip: Number(skip) || 0 },
        { $limit: Number(limit) || 15 },
    ];
    const result = yield course_model_1.Course.aggregate(pipeline);
    const total = yield course_model_1.Course.countDocuments(whereConditions);
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
const getSingleCourseFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: 'lessions',
                localField: 'courseId',
                foreignField: 'courseId',
                as: 'All_lessions',
            },
        },
        {
            $lookup: {
                from: 'quizzes',
                localField: 'courseId',
                foreignField: 'courseId',
                as: 'quizzes',
            },
        },
    ]);
    return result[0];
});
// update e form db
const updateCourseFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { publish } = payload, otherData = __rest(payload, ["publish"]);
    const updateData = Object.assign({}, otherData);
    if (publish && Object.keys(publish).length > 0) {
        Object.keys(publish).forEach(key => {
            const publishKey = `publish.${key}`; // `publish.status`
            updateData[publishKey] = publish[key];
        });
    }
    const result = yield course_model_1.Course.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
    });
    return result;
});
// delete e form db
const deleteCourseByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findByIdAndDelete(id);
    return result;
});
exports.CourseService = {
    createCourseByDb,
    getAllCourseFromDb,
    getSingleCourseFromDb,
    updateCourseFromDb,
    deleteCourseByIdFromDb,
};
