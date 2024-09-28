import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { Privilege } from '../src/auth/privilege';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;
  let authService: AuthService;
  let writeToken: string;
  let readToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    authService = app.get(AuthService);
    writeToken = authService.generateToken('1', [Privilege.WriteUsers]);
    readToken = authService.generateToken('1', [Privilege.ReadUsers]);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create, fetch, and update a user', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${writeToken}`)
      .send({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      })
      .expect(201);

    const createdUser = createUserResponse.body;
    createdUserId = createdUser.id;

    const getUserResponse = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${readToken}`)
      .expect(200);

    const fetchedUser = getUserResponse.body;
    expect(fetchedUser.fullName).toBe('John Doe');
    expect(fetchedUser.email).toBe('john.doe@example.com');
    expect(fetchedUser.phone).toBe('1234567890');

    const updateUserResponse = await request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${writeToken}`)
      .send({
        fullName: 'Jane Doe',
      })
      .expect(200);

    const updatedUser = updateUserResponse.body;
    expect(updatedUser.fullName).toBe('Jane Doe');

    const getUpdatedUserResponse = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${readToken}`)
      .expect(200);

    const updatedFetchedUser = getUpdatedUserResponse.body;
    expect(updatedFetchedUser.fullName).toBe('Jane Doe');
    expect(updatedFetchedUser.email).toBe('john.doe@example.com'); // Should remain unchanged
    expect(updatedFetchedUser.phone).toBe('1234567890'); // Should remain unchanged
  });

  it('should return 400 if a required attribute is missing on create', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${writeToken}`)
      .send({
        fullName: 'John MissingEmail',
        phone: '1234567890',
      })
      .expect(400);
  });

  it('should return 404 if the user does not exist', async () => {
    await request(app.getHttpServer())
      .get('/users/99999')
      .set('Authorization', `Bearer ${readToken}`)
      .expect(404);
  });
});
