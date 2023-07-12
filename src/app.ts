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
import paypal from 'paypal-rest-sdk';
// create xss-clean.d.ts file after work this xss
import path from 'path';
import xss from 'xss-clean';
const app: Application = express();
app.use(cors());

// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   })
// );

/*
 app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.DEV_URL)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept")
  next()
}) */
app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPLE_CLIENT_ID as string,
  client_secret: process.env.PAYPLE_SECRET_KEY as string,
});
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
  '/profile',
  run,
  express.static(path.join(__dirname, './uploadFile/profile/'))
);

app.use(
  '/vedios',
  run,
  express.static(path.join(__dirname, './uploadFile/vedios/'))
);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views/success.ejs'));

import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import { uploadSingleImage } from './app/middlewares/uploader.multer';
import routers from './app/routes/index_route';
import { decrypt } from './helper/encryption';

import ApiError from './app/errors/ApiError';
import { IEncodedPaymentData } from './app/interface/encrypt';
import { Purchased_courses } from './app/modules/purchased_courses/purchased_courses.model';

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({ message: 'server is running....' });
  } catch (error) {
    next(error);
  }
  // res.send('server is running');
});

//Application route
app.use('/api/v1', routers);

app.get('/success', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const app = req.query.app;
    if (
      typeof payerId !== 'string' ||
      typeof paymentId !== 'string' ||
      typeof app !== 'string'
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'unauthorized access !!');
    }

    const data = decrypt<IEncodedPaymentData>(app);

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: data?.amount,
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          throw new ApiError(500, 'Payment is deny');
        } else {
          const find = await Purchased_courses.findOne({
            transactionID: paymentId,
          });
          if (!find) {
            const result = await Purchased_courses.create({
              userId: data.userId,
              course: data.course_id,
              transactionID: paymentId,
              'payment.method': 'payple',
            });
            if (!result._id) {
              // res.render('cancle');
              res.status(400).json({
                success: false,
                message: 'payment faild!!',
              });
            }
            // res.render('success', { payment });
            res.status(200).json({
              success: true,
              message: 'payment success!!',
            });
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

app.get(
  '/success2',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.render('success');
    } catch (error) {
      next(error);
    }
  }
);
// Set the views directory and the view engine

app.get('/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new ApiError(404, 'Payment faild');
  } catch (error) {
    next(error);
    console.log(error);
  }
});

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
    // const data = {
    //   name: 'sampod',
    //   datoto: {
    //     sampod: 120,
    //     totoal: 141,
    //   },
    // };
    // const result = encrypt(data);
    // // const decode = decrypt('djdjddkjffff');
    // console.log(result);
  } catch (error) {
    console.log(error);
  }
};
test();

export default app;
