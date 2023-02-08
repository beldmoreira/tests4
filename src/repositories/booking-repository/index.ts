import { prisma } from '@/config';
import { Booking } from '@prisma/client';

async function getBookings(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

const bookingRepository = {
  getBookings,
};

export default bookingRepository;
