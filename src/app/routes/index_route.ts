import express from 'express';

import { AuthRouter } from '../modules/auth/auth.route';

import { AdminRoutes } from '../modules/admin/admin.route';
import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';
import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';
import { GeneralUserRoutes } from '../modules/generalUser/route.GeneralUser';
import { LessionRoute } from '../modules/lession/lession.route';
import { ModeratorRoutes } from '../modules/moderator/moderator.route';
import { PaymentRoute } from '../modules/payment/payment.router';
import { Purchased_coursesRoute } from '../modules/purchased_courses/purchased_courses.route';
import { QuizRoute } from '../modules/quiz/quiz.route';
import { PhotoContestUserRoute } from '../modules/photoContest/photoContest.route';
import { RunContestRoute } from '../modules/run_contest/run_contest.route';
// import { UserRoute } from '../modules/users/users.router';

//https://docs.google.com/document/d/1gTsTpFvhfZB-2y0_BbZQVzmbG3YwsZwPrwAbsYqpOzM/edit
const router = express.Router();

const moduleRoutes = [
  // {
  //   path: '/users',
  //   route: UserRoute,
  // },

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
    // only user login and refresh-token
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
  {
    path: '/payment',
    route: PaymentRoute,
  },
  {
    path: '/photo-contest-join',
    route: PhotoContestUserRoute,
  },
  {
    path: '/run-contest',
    route: RunContestRoute,
  },
  {
    path: '/upload',
    route: FileUploadeRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
