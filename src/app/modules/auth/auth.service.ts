import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { User } from '../users/users.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import { GeneralUser } from '../generalUser/model.GeneralUser';

const loginUserFromDb = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email?.toLowerCase());
  //chack user
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //match password
  if (!(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const loginUserByUidFromDb = async (
  uid: string
): Promise<ILoginUserResponse> => {
  const isUserExist = await GeneralUser.findOne({ uid: uid });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
      name: isUserExist.name,
      _id: isUserExist._id,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
      _id: isUserExist._id,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  //chack this user exist database
  const isUserExist = await User.isUserExist(verifiedToken?.userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    { email: isUserExist.email, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUserFromDb,
  loginUserByUidFromDb,
  refreshToken,
};
