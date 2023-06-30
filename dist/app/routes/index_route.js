"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const admin_route_1 = require("../modules/admin/admin.route");
const course_route_1 = require("../modules/course/course.route");
const route_GeneralUser_1 = require("../modules/generalUser/route.GeneralUser");
const lession_route_1 = require("../modules/lession/lession.route");
const moderator_route_1 = require("../modules/moderator/moderator.route");
const users_router_1 = require("../modules/users/users.router");
const quiz_route_1 = require("../modules/quiz/quiz.route");
const purchased_courses_route_1 = require("../modules/purchased_courses/purchased_courses.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: users_router_1.UserRoute,
    },
    {
        path: '/general-user',
        route: route_GeneralUser_1.GeneralUserRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/moderator',
        route: moderator_route_1.ModeratorRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRouter,
    },
    {
        path: '/course',
        route: course_route_1.CourseRoute,
    },
    {
        path: '/lession',
        route: lession_route_1.LessionRoute,
    },
    {
        path: '/quiz',
        route: quiz_route_1.QuizRoute,
    },
    {
        path: '/purchased-course',
        route: purchased_courses_route_1.Purchased_coursesRoute,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
