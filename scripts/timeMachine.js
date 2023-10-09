export const currentDate = new Date();
export const tomorrowsDate = new Date(currentDate);
tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);
export const afterTomorrowsDate = new Date(currentDate);
afterTomorrowsDate.setDate(afterTomorrowsDate.getDate() + 2);

export const currentMonth = currentDate.getMonth() + 1;
export const currentDay = currentDate.getDate();

export const tomorrowsMonth = tomorrowsDate.getMonth() + 1;
export const tomorrowsDay = tomorrowsDate.getDate();

export const afterTomorrowsMonth = afterTomorrowsDate.getMonth() + 1;
export const afterTomorrowsDay = afterTomorrowsDate.getDate();

export const currentDateFormatted = `${currentDay.toString().padStart(2, "0")}.${currentMonth
    .toString()
    .padStart(2, "0")}`;
export const tomorrowsDateFormatted = `${tomorrowsDay.toString().padStart(2, "0")}.${tomorrowsMonth
    .toString()
    .padStart(2, "0")}`;

export const afterTomorrowsDayFormatted = `${afterTomorrowsDay.toString().padStart(2, "0")}.${afterTomorrowsMonth
    .toString()
    .padStart(2, "0")}`;
