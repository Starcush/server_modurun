import scheduleRepository from '../../repository/scheduleRepository';
import userUtil from '../../util/userUtil';

export default {
  post: async (req, res) => { // 스케줄 생성하기
    const {
      trackId, scheduleTitle, from, to,
    } = req.body;
    const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });

    try {
      const scheduleId = await scheduleRepository.insertSchedule(trackId, scheduleTitle, from, to);
      scheduleRepository.insertUserSchedule(userInfo.userId, scheduleId);
      const scheduleData = await scheduleRepository.getCreatedScheduleData(scheduleId);
      res.status(200).send(scheduleData);
    } catch (err) {
      res.status(400).send();
    }
  },
  get: async (req, res) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    const { filter, userposition, area } = req.params;

    const schedules = await scheduleRepository.getAllSchedule(JSON.parse(filter), JSON.parse(userposition), JSON.parse(area), userId);
    if (schedules.length > 0) {
      res.status(200).json(schedules);
    } else {
      res.send(404);
    }
  },
};
