import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
// create xss-clean.d.ts file after work this xss
import xss from 'xss-clean';
const app: Application = express();

app.use(cors());
app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routers from './app/routes/index_route';
import { jwtHelpers } from './helper/jwtHelpers';
import config from './config';
import { Secret } from 'jsonwebtoken';

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const verifiedUser = jwtHelpers.verifyToken(
      'token',
      config.jwt.secret as Secret
    );
    console.log(verifiedUser);
  } catch (error) {
    next(error);
  }
  // res.send('server is running');
});

//Application route
app.use('/api/v1', routers);

// global error handlar
app.use(globalErrorHandler);

//handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).send({
    success: false,
    message: 'Not found route',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'api not found',
      },
    ],
  });
  next();
});

const test = async () => {
  /*  await AcademicDepartment.deleteMany();
  await AcademicFaculty.deleteMany();
  await AcademicSemester.deleteMany(); */
};
test();

export default app;
