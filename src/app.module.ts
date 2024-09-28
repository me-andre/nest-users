import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepo } from './users/user.repo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    SequelizeModule.forFeature([UserRepo]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [AuthModule],
})
export class AppModule {}
