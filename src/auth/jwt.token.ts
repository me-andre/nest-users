import { Privilege } from './privilege';

export interface JWTToken {
  sub: string;
  privileges: Privilege[];
  iat?: number;
  exp?: number;
}
