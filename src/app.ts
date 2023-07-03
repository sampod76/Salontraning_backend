/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
// create xss-clean.d.ts file after work this xss
import path from 'path';
import xss from 'xss-clean';
const app: Application = express();

app.use(cors());
app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const run: RequestHandler = (req, res, next) => {
  try {
    jwtHelpers.verifyToken(`${req.params.id}`, config.jwt.secret as string);
    next();
  } catch (error) {
    next(error);
  }
};

app.use(
  `/images/:id`,
  run,
  express.static(path.join(__dirname, './uploadFile/images/'))
);

app.use(
  '/vedios/:id',
  run,
  express.static(path.join(__dirname, './uploadFile/vedios/'))
);

import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import { uploadSingleImage } from './app/middlewares/uploader.multer';
import routers from './app/routes/index_route';
import config from './config';
import { jwtHelpers } from './helper/jwtHelpers';

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
    res.send({ message: 'server is running....' });
  } catch (error) {
    next(error);
  }
  // res.send('server is running');
});

app.post('/', async (req: Request, res: Response, next: NextFunction) => {
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

    res.send({ message: 'server is running....' });
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
  try {
    // const result = await Course.updateMany(
    //   {},
    //   { $rename: { thimble: 'thumbnail' } }
    // );
    // const result2 = await Lession.updateMany(
    //   {},
    //   { $rename: { thimble: 'thumbnail' } }
    // );
    // console.log(result, result2);
    const item_list = {
      items: [
        {
          name: 'Item 1',
          sku: 'SKU-001',
          price: 50.0,
          currency: 'USD',
          quantity: 2,
        },
        {
          name: 'Item 2',
          sku: 'SKU-002',
          price: 30.0,
          currency: 'USD',
          quantity: 1,
        },
      ],
    };

    const mappedData = item_list?.items?.map(item => ({
      ...item,
      price: String(item.price),
    }));
    console.log(mappedData);
  } catch (error) {
    console.log(error);
  }
};
test();

export default app;
