/* eslint-disable no-unused-vars */

import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne,
} from 'typeorm';
import Rate from './Rate';
import UserTrack from './UserTrack';
import Track from './Track';
import UserSchedule from './UserSchedule';

@Entity()
class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: false })
  scheduleFrom: Date;

  @Column({ nullable: false })
  scheduleTo: Date;

  @ManyToOne((type) => Track, (track) => track.schedules, { onDelete: 'CASCADE' })
  track: Track;

  @OneToMany((type) => UserSchedule, (userSchedule) => userSchedule.schedule)
  userSchedules: UserSchedule[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updatedAt: Date;
}
export default Schedule;
