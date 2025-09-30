import { expressjwt, GetVerificationKey } from 'express-jwt';
import { Request } from 'express';
import jwksClient from 'jwks-rsa';
import { configENV } from '../../config/config';
import { AuthCookies } from '../types/index';

export default expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: configENV.jwksUri,
    cache: true,
    rateLimit: true,
  }) as unknown as GetVerificationKey,
  algorithms: ['RS256'],
  issuer: 'Auth-services',
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    // Bearer eyjllsdjfljlasdjfljlsadjfljlsdf(tocken)
    if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
      const token = authHeader.split(' ')[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as AuthCookies;

    if (accessToken) {
      return accessToken;
    }
  },
});
