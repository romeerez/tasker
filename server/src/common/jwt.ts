import { sign } from 'jsonwebtoken';
import { jwtConstants } from 'common/constants';

export { decode } from 'jsonwebtoken';

// eslint-disable-next-line
export const signJWT = (payload: string | Buffer | object) =>
  sign(payload, jwtConstants.secret);
