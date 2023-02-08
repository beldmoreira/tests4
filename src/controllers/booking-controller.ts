import { AuthenticatedRequest } from '@/middlewares';
import bookingRepository from '@/repositories/booking-repository';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingRepository.getBookings(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
