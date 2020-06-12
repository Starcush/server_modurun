/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { TrackSeed } from '../seed/track.seed';
import { UserSeed } from '../seed/user.seed';
import { UserTrackSeed } from '../seed/usertrack.seed';
import { RateSeed } from '../seed/rate.seed';

export class SeedCategory1591756371816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const trackSeed: any = TrackSeed.makeFakeData;
    const userSeed: any = UserSeed;
    const rateSeed: any = RateSeed;
    await getRepository('track').save(trackSeed);
    await getRepository('user').save(userSeed);
    await getRepository('user_track').save(UserTrackSeed);
    await getRepository('rate').save(rateSeed);
  }

  // eslint-disable-next-line no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {

  }
}
