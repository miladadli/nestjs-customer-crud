import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('Customer API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdId: string;
  const baseEmail = 'john.doe';
  const basePhone = '+1415555267';
  const baseBank = '7992739871';
  const unique = () => Math.floor(Math.random() * 1000000);
  const randomAlpha = () =>
    Array.from({ length: 6 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ).join('');
  const randomDate = () => {
    const year = 1980 + Math.floor(Math.random() * 30);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    return new Date(
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    ).toISOString();
  };
  const validCustomer = () => ({
    firstName: `John${randomAlpha()}`,
    lastName: `Doe${randomAlpha()}`,
    dateOfBirth: randomDate(),
    phoneNumber: '+14155552671',
    email: `${baseEmail}${unique()}@example.com`,
    bankAccountNumber: '79927398713',
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    dataSource = app.get(DataSource);
    await dataSource.query(
      'TRUNCATE TABLE customers RESTART IDENTITY CASCADE;',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a customer', async () => {
    const customer = validCustomer();
    const res = await request(app.getHttpServer())
      .post('/customers')
      .send(customer)
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(customer.email);
    createdId = res.body.id;
  });

  it('should fail to create duplicate email', async () => {
    const customer = validCustomer();
    await request(app.getHttpServer())
      .post('/customers')
      .send(customer)
      .expect(201);
    await request(app.getHttpServer())
      .post('/customers')
      .send({ ...validCustomer(), email: customer.email })
      .expect(409);
  });

  it('should fail to create duplicate name+DOB', async () => {
    const customer = validCustomer();
    await request(app.getHttpServer())
      .post('/customers')
      .send(customer)
      .expect(201);
    await request(app.getHttpServer())
      .post('/customers')
      .send({
        ...validCustomer(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        dateOfBirth: customer.dateOfBirth,
      })
      .expect(409);
  });

  it('should fail for missing required fields', async () => {
    const customer = validCustomer();
    for (const field of [
      'firstName',
      'lastName',
      'dateOfBirth',
      'phoneNumber',
      'email',
      'bankAccountNumber',
    ]) {
      const invalid = { ...customer };
      delete invalid[field];
      await request(app.getHttpServer())
        .post('/customers')
        .send(invalid)
        .expect(400);
    }
  });

  it('should get all customers with pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/customers?limit=10&offset=0')
      .expect(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get a customer by id', async () => {
    const customer = validCustomer();
    const createRes = await request(app.getHttpServer())
      .post('/customers')
      .send(customer)
      .expect(201);
    const id = createRes.body.id;
    const res = await request(app.getHttpServer())
      .get(`/customers/${id}`)
      .expect(200);
    expect(res.body.id).toBe(id);
  });

  it('should get a customer by email', async () => {
    const customer = validCustomer();
    const createRes = await request(app.getHttpServer())
      .post('/customers')
      .send(customer)
      .expect(201);
    const res = await request(app.getHttpServer())
      .get(`/customers/email/${customer.email}`)
      .expect(200);
    expect(res.body.email).toBe(customer.email);
  });

  it('should update a customer', async () => {
    const customer = validCustomer();
    const createRes = await request(app.getHttpServer())
      .post('/customers')
      .send(customer)
      .expect(201);
    const id = createRes.body.id;
    const res = await request(app.getHttpServer())
      .put(`/customers/${id}`)
      .send({ firstName: 'Jane' })
      .expect(200);
    expect(res.body.firstName).toBe('Jane');
  });

  it('should fail to update to duplicate email', async () => {
    const customer1 = validCustomer();
    const customer2 = validCustomer();
    const res1 = await request(app.getHttpServer())
      .post('/customers')
      .send(customer1)
      .expect(201);
    const res2 = await request(app.getHttpServer())
      .post('/customers')
      .send(customer2)
      .expect(201);
    await request(app.getHttpServer())
      .put(`/customers/${res2.body.id}`)
      .send({ email: customer1.email })
      .expect(409);
  });

  it('should delete a customer', async () => {
    const customer = validCustomer();
    const createRes = await request(app.getHttpServer())
      .post('/customers')
      .send(customer)
      .expect(201);
    const id = createRes.body.id;
    await request(app.getHttpServer()).delete(`/customers/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/customers/${id}`).expect(404);
  });

  it('should return 404 for non-existent customer', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer()).get(`/customers/${fakeId}`).expect(404);
    await request(app.getHttpServer())
      .put(`/customers/${fakeId}`)
      .send({ firstName: 'Nobody' })
      .expect(404);
    await request(app.getHttpServer())
      .delete(`/customers/${fakeId}`)
      .expect(404);
  });
});
