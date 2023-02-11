import app, { init } from '@/app';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createUser,
  createEnrollmentWithAddress,
  createTicket,
  createTicketTypeRemote,
  createPayment,
  createRoomWithHotelId,
  createHotel,
  createTicketTypeWithHotel,
  createTicketType,
  createBooking,
} from '../factories';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and the booking info', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const room = await createRoomWithHotelId(createdHotel.id);
      const userId = user.id;
      const roomId = room.id;
      const booking = await createBooking(userId, roomId);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it('should respond with status 404 when the does not have booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const room = await createRoomWithHotelId(createdHotel.id);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

// describe('POST /booking', () => {
//   it('should respond with status 401 if no token is given', async () => {
//     const response = await server.post('/booking');

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it('should respond with status 401 if given token is not valid', async () => {
//     const token = faker.lorem.word();

//     const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it('should respond with status 401 if there is no session for given token', async () => {
//     const userWithoutSession = await createUser();
//     const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//     const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   describe('when token is valid', () => {
//     it('should respond with status 403 when there is no enrollment for given user', async () => {
//       const createRandomBody = () => ({
//         roomId: faker.datatype.number(),
//       });

//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const body = createRandomBody();
//       const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

//       expect(response.status).toBe(httpStatus.FORBIDDEN);
//     });
//     it('should respond with status 403 when there is no ticket for given user', async () => {
//       const createRandomBody = () => ({
//         roomId: faker.datatype.number(),
//       });

//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const body = createRandomBody();
//       await createEnrollmentWithAddress(user);
//       const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

//       expect(response.status).toBe(httpStatus.FORBIDDEN);
//     });
//   });
// });
