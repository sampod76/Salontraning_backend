import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
// create xss-clean.d.ts file after work this xss
// import os from 'os';
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

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtain the MAC address
    // const networkInterfaces = os.networkInterfaces();
    // console.log(networkInterfaces);
    // const interfaceName = 'eth0'; // Adjust the interface name as needed
    // if (networkInterfaces[interfaceName]) {
    //   const macAddress = networkInterfaces[interfaceName][0].mac;
    //   console.log('MAC address:', macAddress);
    // } else {
    //   console.log(`Network interface '${interfaceName}' not found.`);
    // }
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
