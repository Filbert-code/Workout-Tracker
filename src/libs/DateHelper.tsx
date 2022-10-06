import moment from "moment";
import { Moment } from "moment";

export const getDatesForTheWeek = (givenDate: Moment) => {
  let thisWeekDates: Moment[] = [];
  let currDay = givenDate.day();
  if (currDay === 0) {
    currDay = 7;
  }

  for (let i = 0; i < 7; i++) {
    const givenDateCopy = givenDate.clone();
    thisWeekDates.push(givenDateCopy.weekday(i + 1));
  }
  return thisWeekDates;
};

export const getTimestampStartEnd = (relativeDate: Moment) => {
  const thisWeekDates = getDatesForTheWeek(relativeDate);
  const start = thisWeekDates[0].startOf("day").valueOf().toString();
  const end = thisWeekDates[thisWeekDates.length - 1]
    .endOf("day")
    .valueOf()
    .toString();
  return {
    start: start,
    end: end,
  };
};
