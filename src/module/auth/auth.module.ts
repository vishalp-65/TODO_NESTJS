import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { Role } from 'src/shared/entities/roles.entity';
import { AuthService } from './service/auth.service';
import User from '../user/entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersService } from '../user/service/users.service';
import UserRepository from '../user/repositories/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService, UserRepository],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
