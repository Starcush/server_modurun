/* eslint-disable no-await-in-loop */
// eslint-disable-next-line no-unused-vars
// import { Request, Response } from 'express';
import userUtil from '../../util/userUtil';
import userScheduleRepository from '../../repository/userScheduleRepository';
import scheduleRepository from '../../repository/scheduleRepository';
import formatUtil from '../../util/formatUtil';
import '../../env';
import trackRepository from '../../repository/trackRepository';

export default {
  post: async (req, res) => { // 다른 스케줄에 참여
    const { scheduleId } = req.body;
    try {
      const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decode) => {
        if (err) return err;
        return decode.data;
      });
      scheduleRepository.insertUserSchedule(userInfo.userId || process.env.USER_ID, scheduleId);
      const scheduleData = await scheduleRepository.getScheduleData(scheduleId);
      const scheduleUsers = await scheduleRepository.getScheduleUsers(scheduleId);
      scheduleData[0].participants = scheduleUsers.length;
      if (scheduleUsers) {
        res.status(200).send(formatUtil.changeToJson(scheduleData));
      } else {
        res.status(404).send('Schedule not found');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req, res) => { // 유저의 스케줄 목록 불러오기
    try {
      const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decode) => {
        if (err) return err;
        return decode.data;
      });
      const userSchedules = await userScheduleRepository.getUserSchedules(userInfo.userId || process.env.USER_ID);

      for (let i = 0; i < userSchedules.length; i += 1) {
        const scheduleUsers = await scheduleRepository.getScheduleUsers(userSchedules[i].id);
        userSchedules[i].participants = scheduleUsers.length;
      }
      if (userSchedules) {
        res.status(200).send(formatUtil.changeToJson(userSchedules));
      } else {
        res.status(404).send('Schedule not found');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  delete: async (req, res) => { // 내 스케줄 삭제하기, 내가 마지막 유저라면 스케줄 자체를 삭제
    const { scheduleId } = req.body;
    try {
      const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decode) => {
        if (err) return err;
        return decode.data;
      });
      const scheduleUsers = await scheduleRepository.getScheduleUsers(scheduleId);
      let response = null;
      if (scheduleUsers.length === 1) {
        response = await userScheduleRepository.deleteUserSchedule(userInfo.userId || process.env.USER_ID);
        scheduleRepository.deleteSchedule(scheduleId);
      } else {
        response = await userScheduleRepository.deleteUserSchedule(userInfo.userId || process.env.USER_ID);
      }
      if (response) {
        res.status(200).send();
      } else {
        res.status(404).send('Schedule not found');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getCompltedSchedule: async (req, res) => {
    // 유저의 스케줄 목록 불러오기
    // 현재 시간을 기준으로 3시간 지난 스케쥴을 가져오고
    // rate가 null인 값을 보내준다

    try {
      const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decode) => {
        if (err) return err;
        return decode.data;
      });
      const userId = userInfo.userId || process.env.USER_ID;
      const userCompletedSch = await userScheduleRepository.getAllUsersSchedule(userId);
      for (let i = 0; i < userCompletedSch.length; i += 1) {
        const rate: any = await trackRepository.findRateTracks(userId, userCompletedSch[i].id);
        userCompletedSch[i].trackId = userCompletedSch[i].id;
        delete userCompletedSch[i].id;
        if (rate[0]) {
          userCompletedSch[i].rateValue = rate[0].rateValue;
        } else {
          userCompletedSch[i].rateValue = 0;
        }
      }
      const filteredRate = userCompletedSch.filter(ele=> !ele.rateValue);

      const filteredDate = filteredRate.filter((ele)=>{
        const AFTER_THREE_HOUR = new Date((new Date(ele.scheduleTo)).valueOf() + 1000 * 3600 * 3);
        return AFTER_THREE_HOUR <= new Date();
      });

      if (filteredDate) {
        res.status(200).send(formatUtil.changeToJson(filteredDate));
      } else {
        res.status(404).send('Schedule not found');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};
