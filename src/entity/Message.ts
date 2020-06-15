/* eslint-disable no-unused-vars */

import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne,
} from 'typeorm';
import User from './User';

@Entity()
class Message {
    // static findOne(arg0: { where: { email: any; }; }) {
    //     throw new Error("Method not implemented.");
    // }
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    scheduleId: number;

    @Column({ nullable: false })
    userId: number;

    @Column({ nullable: false })
    message: string;

    @ManyToOne((type) => User, (user) => user.messages)
    user: User;

    // @OneToMany((type) => UserTrack, (userTrack) => userTrack.user)
    // userTracks: UserTrack[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    public updatedAt: Date;
}
export default Message;
