import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { jwtHelpers } from '../../helper/jwtHelpers';
import ApiError from '../errors/ApiError';

const authMiddleware =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      let verifiedUser = null;
      const token = req.headers.authorization;
      // console.log(token, Math.random() * 100);
      /* const tokenCookie = req.cookies;
      console.log(tokenCookie, '1717174174');
      if (!token && !tokenCookie) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
      } */
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
      }
      // verify token only general user

      if (token) {
        verifiedUser = jwtHelpers.verifyToken(
          token,
          config.jwt.secret as Secret
        );
      }
      // console.log(verifiedUser);
      //রিকুয়েস্ট টার মধ্যে আমরা কোন কিছু typescript এর কারণে সরাসরি এড করতে পারবো না | তার জন্য আমাদেরকে index.d.ts --> interface a এই নামে একটা ফাইল বানাতে হবে
      // {role,email}

      // if (
      //   !tokenCookie &&
      //   verifiedUser?.role &&
      //   verifiedUser.role === ENUM_USER_ROLE.ADMIN
      // ) {
      //   throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
      // }

      // if (tokenCookie) {
      //   const verifiAdmin = jwtHelpers.verifyToken(
      //     tokenCookie,
      //     config.jwt.refresh_secret as Secret
      //   );
      //   if (verifiAdmin?.role === ENUM_USER_ROLE.ADMIN) {
      //     verifiedUser = verifiAdmin;
      //   }
      // }

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
    }
  };

export default authMiddleware;
