import express from 'express';

import { AuthRouter } from '../modules/auth/auth.route';

import { AdminRoutes } from '../modules/admin/admin.route';
import { CourseRoute } from '../modules/course/course.route';
import { GeneralUserRoutes } from '../modules/generalUser/route.GeneralUser';
import { LessionRoute } from '../modules/lession/lession.route';
import { ModeratorRoutes } from '../modules/moderator/moderator.route';
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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
