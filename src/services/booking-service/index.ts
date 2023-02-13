import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';

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

async function postBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote) {
    throw forbiddenError();
  }

  const room = await bookingRepository.getRooms(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.Booking.length >= room.capacity) {
    throw forbiddenError();
  }
  const bookingAlreadyExists = await bookingRepository.getBookings(userId);
  if (bookingAlreadyExists) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.postBooking(userId, roomId);
  return { id: booking.id };
}

async function changeBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote) {
    throw forbiddenError();
  }

  const room = await bookingRepository.getRooms(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length >= room.capacity) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.getBookings(userId);
  if (!booking) {
    throw forbiddenError();
  }
  const change = await bookingRepository.changeBooking(booking.id, roomId);
  return { id: booking.id };
}

const bookingService = { getBookings, postBooking, changeBooking };

export default bookingService;
