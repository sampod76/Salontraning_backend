"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// create xss-clean.d.ts file after work this xss
const path_1 = __importDefault(require("path"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
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
app.use((0, xss_clean_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
const run = (req, res, next) => {
    try {
        // jwtHelpers.verifyToken(`${req.headers.authorization}`, config.jwt.secret as string);
        // console.log('first');
        next();
    }
    catch (error) {
        next(error);
    }
};
app.use('/images', run, express_1.default.static(path_1.default.join(__dirname, './uploadFile/images/')));
app.use('/vedios', run, express_1.default.static(path_1.default.join(__dirname, './uploadFile/vedios/')));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
// import { uploadSingleImage } from './app/middlewares/uploader.multer';
const index_route_1 = __importDefault(require("./app/routes/index_route"));
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        next(error);
    }
    // res.send('server is running');
}));
app.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ message: 'server is running....' });
    }
    catch (error) {
        next(error);
    }
    // res.send('server is running');
}));
//Application route
app.use('/api/v1', index_route_1.default);
app.get('/success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.log(error);
    }
}));
// app.get('/cancel', async (req: Request, res: Response) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// });
// global error handlar
app.use(globalErrorHandler_1.default);
//handle not found route
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).send({
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
const test = () => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.log(error);
    }
});
test();
exports.default = app;
