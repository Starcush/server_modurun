/* eslint-disable no-unused-vars */

import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import Rate from './Rate';
import UserTrack from './UserTrack';

@Entity()
class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  trackTitle: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true })
  destination: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  route;

  @Column({ type: 'double', default: 0 })
  trackLength;

  @OneToMany((type) => Rate, (rate) => rate.track)
  rates: Rate[];

  @OneToMany((type) => UserTrack, (userTrack) => userTrack.track)
  userTracks: UserTrack[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updatedAt: Date;
}
export default Track;
