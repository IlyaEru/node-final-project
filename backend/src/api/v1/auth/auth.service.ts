import httpStatus from 'http-status';
import { ApiError } from '../../../modules/error';
import Token from '../../../modules/token/token.model';
import {
  generateAuthTokens,
  verifyToken,
} from '../../../modules/token/token.service';
import { getUserById, getUserByUsername } from '../user/user.service';
import { IUserDocument } from '../user/user.type';

// login with email and username if valid returns user document if not
// throws an apiError
const loginWithUsernameAndEmail = async (
  username: string,
  email: string,
): Promise<IUserDocument> => {
  const user = await getUserByUsername(username);

  if (!user || user.email !== email.toLowerCase()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or email');
  }
  return user;
};

const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDocument = await Token.findOne({
    token: refreshToken,
    type: 'refresh',
    blacklisted: false,
  });

  if (!refreshTokenDocument) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  } else {
    await refreshTokenDocument.remove();
  }
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDocument = await verifyToken(refreshToken, 'refresh');

    const user = await getUserById(refreshTokenDocument.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await refreshTokenDocument.remove();

    const tokens = await generateAuthTokens(user.id);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};
export { loginWithUsernameAndEmail, logout, refreshAuth };
