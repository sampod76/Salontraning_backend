import express from 'express';

import { AuthRouter } from '../modules/auth/auth.route';

import { AdminRoutes } from '../modules/admin/admin.route';
import { GeneralUserRoutes } from '../modules/generalUser/route.GeneralUser';
import { ModeratorRoutes } from '../modules/moderator/moderator.route';
import { UserRoute } from '../modules/users/users.router';
import { CourseRoute } from '../modules/courseDepartment/course.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
