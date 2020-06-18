// eslint-disable-next-line no-unused-vars
// import { Request, Response } from 'express';
import userUtil from '../../util/userUtil';
import userScheduleRepository from '../../repository/userScheduleRepository';
import scheduleRepository from '../../repository/scheduleRepository';

export default {
  post: async (req, res) => { // 다른 스케줄에 참여
    const { scheduleId } = req.body;
    try {
      const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decode) => {
        if (err) return err;
        return decode.data;
      });
      scheduleRepository.insertUserSchedule(userInfo.userId, scheduleId);
      const scheduleData = await scheduleRepository.getScheduleData(scheduleId);
      const scheduleUsers = await scheduleRepository.getScheduleUsers(scheduleId);
      scheduleData[0].participants = scheduleUsers.length;
      if (scheduleUsers) {
        res.status(200).send(scheduleData);
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
      const userSchedules = await userScheduleRepository.getUserSchedules(userInfo.userId);

      for (let i = 0; i < userSchedules.length; i += 1) {
        const scheduleUsers = await scheduleRepository.getScheduleUsers(userSchedules[i].id);
        userSchedules[i].participants = scheduleUsers.length;
      }
      if (userSchedules) {
        res.status(200).send(userSchedules);
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
        response = await userScheduleRepository.deleteUserSchedule(userInfo.userId);
        scheduleRepository.deleteSchedule(scheduleId);
      } else {
        response = await userScheduleRepository.deleteUserSchedule(userInfo.userId);
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
};
