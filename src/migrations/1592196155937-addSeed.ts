/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { TrackSeed } from '../seed/track.seed';
import { UserSeed } from '../seed/user.seed';
import { RateSeed } from '../seed/rate.seed';
import { MessageSeed } from '../seed/message.seed';
import { UserTrackSeed } from '../seed/usertrack.seed';

export class addSeed1592196155937 implements MigrationInterface {
    name = 'addSeed1592196155937'

    public async up(queryRunner: QueryRunner): Promise<void> {
      const trackSeed: any = TrackSeed.makeFakeData;
      const userSeed: any = UserSeed;
      const rateSeed: any = RateSeed;
      const messageSeed: any = MessageSeed;
      await getRepository('track').save(trackSeed);
      await getRepository('user').save(userSeed);
      await getRepository('user_track').save(UserTrackSeed);
      await getRepository('rate').save(rateSeed);
      await getRepository('message').save(messageSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      // await queryRunner.query("ALTER TABLE `message` DROP FOREIGN KEY `FK_446251f8ceb2132af01b68eb593`");
      // await queryRunner.query("ALTER TABLE `rate` DROP FOREIGN KEY `FK_487e5917a7bb761bf35835068bf`");
      // await queryRunner.query("ALTER TABLE `rate` DROP FOREIGN KEY `FK_7440b44c5acbec8b2ebfc3af7d2`");
      // await queryRunner.query("ALTER TABLE `user_track` DROP FOREIGN KEY `FK_acdd9f9001b16ff1b37d52c0ba6`");
      // await queryRunner.query("ALTER TABLE `user_track` DROP FOREIGN KEY `FK_0ef9f7bea0ab00b8bb87935dc2a`");
      // await queryRunner.query("DROP TABLE `message`");
      // await queryRunner.query("DROP TABLE `user`");
      // await queryRunner.query("DROP TABLE `rate`");
      // await queryRunner.query("DROP TABLE `track`");
      // await queryRunner.query("DROP TABLE `user_track`");
    }
}
