import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Customer API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/customers')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '+14155552671',
        email: 'john.doe@example.com',
        bankAccountNumber: '79927398713',
      })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('john.doe@example.com');
    expect(res.body.bankAccountNumber).toMatch(/\*+\d{4}$/);
  });

  it('should fail for invalid email', async () => {
    await request(app.getHttpServer())
      .post('/customers')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '+14155552671',
        email: 'not-an-email',
        bankAccountNumber: '79927398713',
      })
      .expect(400);
  });
});
