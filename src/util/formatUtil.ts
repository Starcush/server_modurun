export default {
  /*
   * format util
   */
  changeToJson: (trackOrSchedule: any) => {
    return trackOrSchedule.map((ele) => {
      ele.route = ele.route ? JSON.parse(ele.route) : null;
      ele.origin = ele.origin ? JSON.parse(ele.origin) : null;
      ele.destination = ele.destination ? JSON.parse(ele.destination) : null;
      return ele;
    });
  },
  changeToJsonAllSch: (trackOrSchedule: any) => {
    return trackOrSchedule.map((ele) => {
      ele.track.route = ele.track.route ? JSON.parse(ele.track.route) : null;
      ele.track.origin = ele.track.origin ? JSON.parse(ele.track.origin) : null;
      ele.track.destination = ele.track.destination ? JSON.parse(ele.track.destination) : null;
      return ele;
    });
  },
};
