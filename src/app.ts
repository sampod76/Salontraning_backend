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
// import xss from 'xss-clean';
import helmetOriginal from 'helmet';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import { uploadSingleImage } from './app/middlewares/uploader.multer';


import routers from './app/routes/index_route';

const app: Application = express();
// app.use(cors());

app.use(helmetOriginal());
app.use(
  cors({
    origin: ['https://salontrainingpro.app', 'http://localhost:3000'],
    credentials: true,
  })
);



// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   })
// );

//  app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", 'https://salontrainingpro.app')
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept")
//   next()
// })
// const allowedHeaders = [
//   'Origin',
//   'X-Requested-With',
//   'Content-Type',
//   'Accept',
//   'Authorization',
// ];

// app.use(
//   cors({
//     origin: 'https://salontrainingpro.app',
//     allowedHeaders: allowedHeaders,
//   })
// );

// app.use(xss());
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
  express.static(path.join(__dirname, '../dist/uploadFile/images/'))
);

app.use(
  '/profile',
  run,
  express.static(path.join(__dirname, '../dist/uploadFile/profile/'))
);

app.use(
  '/vedios',
  run,
  express.static(path.join(__dirname, '../dist/uploadFile/vedios/'))
);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views/success.ejs'));


app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({ message: 'server is running....' });
  } catch (error) {
    next(error);
  }
  // res.send('server is running');
});

/*
 const revenuecat = new Revenuecat({
  secretKey: "sk_AwzheKPxGcMLbnqWdOeFWhRfcwKIA",
  iosKey: "993dd49ebcba4546aa3c4657330ac6e0",
  androidKey: process.env.androidKey as string,
}) 
*/
const test = async () => {
/*  
 const url = 'https://api.revenuecat.com/v1/apps/appcadee85965/subscribers/882b1b28b5664a0ea3ecc7a6efb56b9b';

  try {
const data =await revenuecat
.getSubscriptions({ userId:"$RCAnonymousID:882b1b28b5664a0ea3ecc7a6efb56b9b" })
// .then(res => console.log(res.subscriber, 'getSubscriptions'))
console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
   
  } 
  */
 
//  const result= await firebaseAdmin.auth().setCustomUserClaims("St9VaFVV3JX8QFEGwFQd3A3psR23",{_id:"650fd9626e7c6052b7e19242",role:"general-user"});
// console.log(result);



};
test();

//Application route
app.use('/api/v1', routers);

// Set the views directory and the view engine

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



export default app;
