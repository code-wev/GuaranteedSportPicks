import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserRole } from 'src/model/user/user.schema';

/**
 * Generates a JWT token for a user based on their email and user ID.
 *
 * @param email - The user's email.
 * @param userId - The user's unique ID.
 * @returns {Promise<string>} - A promise that resolves to the signed JWT token.
 */
const EncodeToken = async (_id: string, email: string, role: UserRole): Promise<string> => {
  const KEY: string = config.JWT_SECRET;
  const EXPIRE = { expiresIn: config.JWT_EXPIRATION_TIME };
  const PAYLOAD = { _id, email, role };
  return jwt.sign(PAYLOAD,role, KEY, EXPIRE as jwt.SignOptions);
};
export default EncodeToken;
