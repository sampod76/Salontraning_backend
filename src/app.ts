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

// app.use(
//   cors({
//     origin: process.env.LOCALHOST_CLIENT_SIDE,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   })
// );

/* app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.DEV_URL)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept")
  next()
}) */
app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const run: RequestHandler = (req, res, next) => {
  try {
    // jwtHelpers.verifyToken(`${req.headers.authorization}`, config.jwt.secret as string);
    // console.log('first');
    next();
  } catch (error) {
    next(error);
  }
};

app.use(
  '/images',
  run,
  express.static(path.join(__dirname, './uploadFile/images/'))
);

app.use(
  '/vedios',
  run,
  express.static(path.join(__dirname, './uploadFile/vedios/'))
);

import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import { uploadSingleImage } from './app/middlewares/uploader.multer';
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
    res.send({ message: 'server is running....' });
  } catch (error) {
    next(error);
  }
  // res.send('server is running');
});

app.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({ message: 'server is running....' });
  } catch (error) {
    next(error);
  }
  // res.send('server is running');
});

//Application route
app.use('/api/v1', routers);

app.get('/success', async (req: Request, res: Response) => {
  try {
    // const payerId = req.query.PayerID;
    // const paymentId = req.query.paymentId;
    // console.log(payerId, paymentId);
    // const execute_payment_json = {
    //   payer_id: payerId,
    //   transactions: [
    //     {
    //       amount: {
    //         currency: 'USD',
    //         total: amt,
    //       },
    //     },
    //   ],
    // };
  } catch (error) {
    console.log(error);
  }
});

// app.get('/cancel', async (req: Request, res: Response) => {
//   try {

//   } catch (error) {
//     console.log(error);
//   }
// });

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
    // console.log(result, result2);
    // const result = await Lession.updateMany(
    //   {},
    //   {
    //     $set: {
    //       vedio:
    //         'https://player.vimeo.com/video/829783962?h=47a19669a0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    //     },
    //   }
    // );
    // console.log(result);
  } catch (error) {
    console.log(error);
  }
};
test();

export default app;
