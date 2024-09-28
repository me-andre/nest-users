import { Column, Model, Table } from 'sequelize-typescript';
import { UserAttrs } from './user.attrs';

@Table({ tableName: 'users' })
export class UserRepo extends Model<UserAttrs, Omit<UserAttrs, 'id'>> {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  fullName!: string;

  @Column
  email!: string;

  @Column
  phone!: string;
}
