import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { ENUM_USER_ROLE } from '../../enums/users';
import { jwtHelpers } from '../../helper/jwtHelpers';
import ApiError from '../errors/ApiError';

const authMiddleware =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      console.log(token, Math.random() * 100);
      // const tokenCookie = req.cookies.refreshToken;
      // console.log(token);
      // console.log(tokenCookie, 'cookie');
      // if (!tokenCookie) {
      //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized ');
      // }

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized ');
      }

      // verify token
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      // if (tokenCookie) {
      // verifiedUser = jwtHelpers.verifyToken(
      //   tokenCookie,
      //   config.jwt.refresh_secret as Secret
      // );
      // }

      //রিকুয়েস্ট টার মধ্যে আমরা কোন কিছু টাইপি স্ক্রিপ্ট এর কারণে সরাসরি এড করতে পারবো না | তার জন্য আমাদেরকে index.d.ts --> interface a এই নামে একটা ফাইল বানাতে হবে

      // {role,email}
      if (!verifiedUser?.role) {
        verifiedUser.role = ENUM_USER_ROLE.GENERAL_USER;
      }
      req.user = verifiedUser;

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser?.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
      }

      //chack token user
      // if (
      //   !(await User.isUserExist(verifiedUser?.email)) &&
      //   !(await GeneralUser.findOne({ uid: verifiedUser?.uid }))
      // ) {
      //   throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
      // }
      next();
    } catch (error) {
      next(error);
      // throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  };

export default authMiddleware;
