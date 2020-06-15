/* eslint-disable no-unused-vars */

import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import Rate from './Rate';
import UserTrack from './UserTrack';

@Entity()
class User {
  // static findOne(arg0: { where: { email: any; }; }) {
  //     throw new Error("Method not implemented.");
  // }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true, default: null })
  password: string;

  @Column({ nullable: true, default: null })
  username: string;

  @Column({ default: 1 })
  loginCount: number;

  @OneToMany((type) => Rate, (rate) => rate.user)
  rates: Rate[];

  @OneToMany((type) => UserTrack, (userTrack) => userTrack.user)
  userTracks: UserTrack[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updatedAt: Date;
}
export default User;
