import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserRole } from 'src/model/user/user.schema';

/**
 * Generates a JWT token for a user based on their email and user ID.
 *
 * @param email - The user's email.
 * @returns {Promise<string>} - A promise that resolves to the signed JWT token.
 */
const EncodeToken = async (_id: string, email: string, role: UserRole): Promise<string> => {
  const KEY: string = config.JWT_SECRET;
  const EXPIRE = { expiresIn: config.JWT_EXPIRATION_TIME };
  const PAYLOAD = { _id, email, role };
  // return jwt.sign(PAYLOAD, KEY, EXPIRE as jwt.SignOptions);
  return jwt.sign(PAYLOAD, KEY, { expiresIn: '30d' });
};
export default EncodeToken;
