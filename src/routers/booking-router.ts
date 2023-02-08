import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBookings } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBookings).post('/').put('/:bookingId');

export { bookingRouter };
