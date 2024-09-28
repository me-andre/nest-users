import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Privilege } from './privilege';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1h' },
          }),
        }),
      ],
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should read JWT_SECRET from the environment', () => {
    const secret = configService.get<string>('JWT_SECRET');
    expect(secret).toBe('jwt-secret'); // Make sure this matches your .env value
  });

  it('should validate the JWT payload correctly', async () => {
    const payload = {
      sub: '123',
      privileges: [Privilege.ReadUsers, Privilege.WriteUsers],
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: '123',
      privileges: [Privilege.ReadUsers, Privilege.WriteUsers],
    });
  });
});
