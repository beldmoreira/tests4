import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBookings(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function postBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'ForbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function changeBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const change = await bookingService.changeBooking(userId, roomId);
    return res.status(httpStatus.OK).send(change);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'ForbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}
