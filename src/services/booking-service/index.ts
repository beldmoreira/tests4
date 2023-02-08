import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getBookings(userId: number) {
  const booking = await bookingRepository.getBookings(userId);
  if (!booking) {
    throw notFoundError();
  }
  return {
    id: booking.id,
    Room: booking.Room,
  };
}

const bookingService = { getBookings };

export default bookingService;
