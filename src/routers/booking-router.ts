import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { changeBookings, getBookings, postBookings } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookings)
  .post('/', postBookings)
  .put('/:bookingId', changeBookings);

export { bookingRouter };
