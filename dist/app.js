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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// create xss-clean.d.ts file after work this xss
const xss_clean_1 = __importDefault(require("xss-clean"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, xss_clean_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const index_route_1 = __importDefault(require("./app/routes/index_route"));
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtain the MAC address
        // const networkInterfaces = os.networkInterfaces();
        // console.log(networkInterfaces);
        const clientIP = req.socket.remoteAddress;
        console.log(clientIP || '0000');
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
//Application route
app.use('/api/v1', index_route_1.default);
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
    /*  await AcademicDepartment.deleteMany();
    await AcademicFaculty.deleteMany();
    await AcademicSemester.deleteMany(); */
});
test();
exports.default = app;
