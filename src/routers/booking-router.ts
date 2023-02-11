import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBookings, postBookings } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBookings).post('/', postBookings).put('/:bookingId');

export { bookingRouter };
