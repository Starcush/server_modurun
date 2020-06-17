
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { TrackSeed } from '../seed/track.seed';
import { UserSeed } from '../seed/user.seed';
import { UserTrackSeed } from '../seed/usertrack.seed';
import { RateSeed } from '../seed/rate.seed';
import { ScheduleSeed } from '../seed/schedule.seed';
import { UserScheduleSeed } from '../seed/userschedule.seed';
import { MessageSeed } from '../seed/message.seed';

export class allToTalbe1592371462962 implements MigrationInterface {
    name = 'allToTalbe1592371462962'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `user_track` (`id` int NOT NULL AUTO_INCREMENT, `bookmark` tinyint NOT NULL DEFAULT 0, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `trackId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
      await queryRunner.query('CREATE TABLE `user_schedule` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `scheduleId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
      await queryRunner.query('CREATE TABLE `schedule` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NULL, `scheduleFrom` datetime NOT NULL, `scheduleTo` datetime NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `trackId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
      await queryRunner.query('CREATE TABLE `track` (`id` int NOT NULL AUTO_INCREMENT, `trackTitle` varchar(255) NULL, `origin` varchar(255) NULL, `destination` varchar(255) NULL, `route` longtext NULL, `trackLength` double NOT NULL DEFAULT 0, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
      await queryRunner.query('CREATE TABLE `rate` (`id` int NOT NULL AUTO_INCREMENT, `rateValue` int NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `trackId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
      await queryRunner.query('CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password` varchar(255) NULL DEFAULT NULL, `username` varchar(255) NULL DEFAULT NULL, `loginCount` int NOT NULL DEFAULT 1, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
      await queryRunner.query('CREATE TABLE `message` (`id` int NOT NULL AUTO_INCREMENT, `scheduleId` int NOT NULL, `userId` int NOT NULL, `message` varchar(255) NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
      await queryRunner.query('ALTER TABLE `user_track` ADD CONSTRAINT `FK_0ef9f7bea0ab00b8bb87935dc2a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `user_track` ADD CONSTRAINT `FK_acdd9f9001b16ff1b37d52c0ba6` FOREIGN KEY (`trackId`) REFERENCES `track`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `user_schedule` ADD CONSTRAINT `FK_e934c0e0a6f68f200292ba41e1d` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `user_schedule` ADD CONSTRAINT `FK_1dde4211ced4d915b1164d47b21` FOREIGN KEY (`scheduleId`) REFERENCES `schedule`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `schedule` ADD CONSTRAINT `FK_440f1134ffd2e086451ab045107` FOREIGN KEY (`trackId`) REFERENCES `track`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `rate` ADD CONSTRAINT `FK_7440b44c5acbec8b2ebfc3af7d2` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `rate` ADD CONSTRAINT `FK_487e5917a7bb761bf35835068bf` FOREIGN KEY (`trackId`) REFERENCES `track`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `message` ADD CONSTRAINT `FK_446251f8ceb2132af01b68eb593` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
      await getRepository('track').save(TrackSeed.makeFakeData);
      await getRepository('user').save(UserSeed);
      await getRepository('user_track').save(UserTrackSeed);
      await getRepository('rate').save(RateSeed);
      await getRepository('schedule').save(ScheduleSeed);
      await getRepository('message').save(MessageSeed);
      await getRepository('user_schedule').save(UserScheduleSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `message` DROP FOREIGN KEY `FK_446251f8ceb2132af01b68eb593`');
      await queryRunner.query('ALTER TABLE `rate` DROP FOREIGN KEY `FK_487e5917a7bb761bf35835068bf`');
      await queryRunner.query('ALTER TABLE `rate` DROP FOREIGN KEY `FK_7440b44c5acbec8b2ebfc3af7d2`');
      await queryRunner.query('ALTER TABLE `schedule` DROP FOREIGN KEY `FK_440f1134ffd2e086451ab045107`');
      await queryRunner.query('ALTER TABLE `user_schedule` DROP FOREIGN KEY `FK_1dde4211ced4d915b1164d47b21`');
      await queryRunner.query('ALTER TABLE `user_schedule` DROP FOREIGN KEY `FK_e934c0e0a6f68f200292ba41e1d`');
      await queryRunner.query('ALTER TABLE `user_track` DROP FOREIGN KEY `FK_acdd9f9001b16ff1b37d52c0ba6`');
      await queryRunner.query('ALTER TABLE `user_track` DROP FOREIGN KEY `FK_0ef9f7bea0ab00b8bb87935dc2a`');
      await queryRunner.query('DROP TABLE `message`');
      await queryRunner.query('DROP TABLE `user`');
      await queryRunner.query('DROP TABLE `rate`');
      await queryRunner.query('DROP TABLE `track`');
      await queryRunner.query('DROP TABLE `schedule`');
      await queryRunner.query('DROP TABLE `user_schedule`');
      await queryRunner.query('DROP TABLE `user_track`');
    }
}
