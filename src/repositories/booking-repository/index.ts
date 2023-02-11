import { prisma } from '@/config';
import { Booking } from '@prisma/client';

async function getBookings(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

async function getRooms(roomId: number) {
  return prisma.room.findFirst({
    where: { id: roomId },
    include: {
      Booking: true,
    },
  });
}

const bookingRepository = {
  getBookings,
  postBooking,
  getRooms,
};

export default bookingRepository;
