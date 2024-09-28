import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Privilege } from './privilege';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(id: string, privileges: Privilege[]): string {
    const payload = {
      sub: id,
      privileges: privileges,
    };
    return this.jwtService.sign(payload);
  }
}
