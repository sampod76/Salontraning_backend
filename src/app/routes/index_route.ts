import express from 'express';

import { AuthRouter } from '../modules/auth/auth.route';

import { AdminRoutes } from '../modules/admin/admin.route';
import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';
import { GeneralUserRoutes } from '../modules/generalUser/route.GeneralUser';
import { LessionRoute } from '../modules/lession/lession.route';
import { ModeratorRoutes } from '../modules/moderator/moderator.route';
import { Purchased_coursesRoute } from '../modules/purchased_courses/purchased_courses.route';
import { QuizRoute } from '../modules/quiz/quiz.route';
import { UserRoute } from '../modules/users/users.router';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },

  {
    path: '/general-user',
    route: GeneralUserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/moderator',
    route: ModeratorRoutes,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/course',
    route: CourseRoute,
  },
  {
    path: '/lession',
    route: LessionRoute,
  },
  {
    path: '/quiz',
    route: QuizRoute,
  },
  {
    path: '/purchased-course',
    route: Purchased_coursesRoute,
  },
  {
    path: '/category',
    route: CategoryRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
