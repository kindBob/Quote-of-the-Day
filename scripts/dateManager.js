export default class DateManager {
    constructor() {
        localStorage.getItem("currentDate")
            ? (this.currentDate = new Date(localStorage.getItem("currentDate")))
            : (this.currentDate = new Date());

        this.tomorrowsDate = new Date(this.currentDate);
        this.tomorrowsDate.setDate(this.tomorrowsDate.getDate() + 1);
        this.afterTomorrowsDate = new Date(this.currentDate);
        this.afterTomorrowsDate.setDate(this.afterTomorrowsDate.getDate() + 2);
    }

    changeCurrentDate(date) {
        const newDate = new Date(this.currentDate);
        newDate.setDate(date);
        localStorage.setItem("currentDate", newDate);
    }

    getCurrentFormattedDate() {
        const day = this.currentDate.getDate().toString().padStart(2, "0");
        const month = (this.currentDate.getMonth() + 1).toString().padStart(2, "0");
        return `${day}.${month}`;
    }

    getTomorrowsFormattedDate() {
        const day = this.tomorrowsDate.getDate().toString().padStart(2, "0");
        const month = (this.tomorrowsDate.getMonth() + 1).toString().padStart(2, "0");
        return `${day}.${month}`;
    }

    getAfterTomorrowsFormattedDate() {
        const day = this.afterTomorrowsDate.getDate().toString().padStart(2, "0");
        const month = (this.afterTomorrowsDate.getMonth() + 1).toString().padStart(2, "0");
        return `${day}.${month}`;
    }
}
