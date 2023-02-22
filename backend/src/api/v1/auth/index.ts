import authRoutes from './auth.routes';
import jwtStrategy from './passport';
import authMiddleware from './auth.middleware';

export { jwtStrategy, authMiddleware };
export default authRoutes;
