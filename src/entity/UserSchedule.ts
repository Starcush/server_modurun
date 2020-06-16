/* eslint-disable no-unused-vars */

import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
} from 'typeorm';
import User from './User';
import Track from './Track';
import Schedule from './Schedule';

@Entity()
class UserSchedule {
  // static findOne(arg0: { where: { email: any; }; }) {
  //     throw new Error("Method not implemented.");
  // }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.userSchedules, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne((type) => Schedule, (schedule) => schedule.userSchedules, { onDelete: 'CASCADE' })
  schedule: Schedule;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updatedAt: Date;
}
export default UserSchedule;
