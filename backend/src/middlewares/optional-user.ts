import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './is-authorized';
import DecodeToken from '../utils/jwt/decode-token';
import { UserRole } from '../model/user/user.schema';

const optionalUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader: string | undefined = req.headers['authorization'] || req.cookies?.token;

    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    const decoded = await DecodeToken(token);

    if (decoded) {
      const { email, _id, role } = decoded as { email: string; _id: string; role: UserRole };
      req.user = { email, _id, role };
    }
  } catch (error) {
    // Ignore invalid optional auth and continue as guest.
  }

  next();
};

export default optionalUser;
