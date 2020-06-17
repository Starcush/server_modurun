/* eslint-disable no-unused-vars */

import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
} from 'typeorm';
import User from './User';
import Track from './Track';

@Entity()
class UserTrack {
  // static findOne(arg0: { where: { email: any; }; }) {
  //     throw new Error("Method not implemented.");
  // }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false, nullable: false })
  bookmark: boolean;

  @ManyToOne((type) => User, (user) => user.userTracks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne((type) => Track, (track) => track.userTracks, { onDelete: 'CASCADE' })
  track: Track;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updatedAt: Date;
}
export default UserTrack;
