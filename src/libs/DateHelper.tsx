const date = new Date();

export const getTodaysDate = () => {
  const day = date.getDay();
  const month = date.getMonth();
  return `${month} / ${day}`;
};

export const getDatesForTheWeek = (givenDate: Date) => {
  let thisWeekDates = [];
  let currDay = givenDate.getDay();
  if (currDay === 0) {
    currDay = 7;
  }
  for (let i = 0; i < 7; i++) {
    const givenDateCopy = new Date(givenDate);
    const day = new Date(
      givenDateCopy.setDate(givenDateCopy.getDate() - currDay + (i + 1))
    );
    thisWeekDates.push(day);
  }
  console.log(thisWeekDates);
  return thisWeekDates;
};

export const getTimestampStartEnd = (relativeDate: Date) => {
  const thisWeekDates = getDatesForTheWeek(relativeDate);
  console.log(`Relative date: ${relativeDate}`);
  const start = new Date(thisWeekDates[0].setHours(0, 0, 0, 0))
    .getTime()
    .toString();
  const end = new Date(
    thisWeekDates[thisWeekDates.length - 1].setHours(23, 59, 59, 999)
  )
    .getTime()
    .toString();
  return {
    start: start,
    end: end,
  };
};
