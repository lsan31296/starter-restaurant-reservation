/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
    return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
        .toString(10)
        .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * This function is used to validate the day of the week (Zero Indexed starting at Sunday)
 * given a reservation_date.
 * 
 * @param {string} reservation_date
 *  a reservation_date in the form 'YYYY-MM-DD' 
 * @returns {number}
 * 0 through 6 mapping to [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 */
function dayOfWeek(reservation_date) {
    const dateObject = new Date();
    const day = reservation_date.slice(8);
    const month = reservation_date.slice(5, 7);
    const year = reservation_date.slice(0,4);

    dateObject.setDate(day);
    dateObject.setMonth(Number(month)-1);
    dateObject.setFullYear(year);

    return dateObject.getDay();
}

/**
 * Determines whether reservation_date is a past date
 * @param {string} reservation_date
 * a reservation_date in the form 'YYYY-MM-DD' 
 * @returns {boolean}
 * returns true if reservation date is in the past and returns false if in the present or future
 */
function isReservationDatePast(reservation_date) {
    const currentDateString = asDateString(new Date());
    const currDay = currentDateString.slice(8);
    const currMonth = currentDateString.slice(5, 7);
    const currYear = currentDateString.slice(0,4);

    const day = reservation_date.slice(8);
    const month = reservation_date.slice(5, 7);
    const year = reservation_date.slice(0,4);
    
    //if current year is greater than reservation year then:return true
    if (currYear > year) return true
    //if current year is equal to reservation year AND current month is greater than reservation month then:
    if (currYear === year && currMonth > month) return true; //return true
    //if year AND month are equal AND current day is greater than reservation day then:return true
    if (currYear === year && currMonth === month && currDay > day) return true;
    //return false
    return false;
}

function isReservationOnSameDay(reservation_date) {
    const currentDateString = asDateString(new Date());

    //if current date string is equal to reservation string then, return true
    if (reservation_date === currentDateString) return true;
    //else return false
    return false;
}

function isReservationTimePast(reservation_date, reservation_time) {
    
    if (isReservationDatePast(reservation_date)) {
        return true;
    } else {
        const currentTime = new Date();
        const reservationHours = Number(reservation_time.slice(0,2));
        const reservationMinutes = Number(reservation_time.slice(3));

        //if reservation date is on the same day then:
        if (isReservationOnSameDay(reservation_date)) {
            //Reservation time should not be in the past, return true if it is
            if (currentTime.getHours() > reservationHours) return true;
            if (currentTime.getHours() === reservationHours && currentTime.getMinutes() >= reservationMinutes) return true;
            //Reservation time should not be before 10:30 AM, return true if it is
            if (reservationHours < 10) return true;
            if (reservationHours === 10 && reservationMinutes < 30) return true;
            //Reservation time should not be after 9:30 PM(21:30), return true if it is
            if (reservationHours > 21) return true;
            if (reservationHours === 21 && reservationMinutes > 30) return true;
        }
        //else, reservation date is in the future
        //Reservation time should not be before 10:30 AM, return true if it is
        if (reservationHours < 10) return true;
        if (reservationHours === 10 && reservationMinutes < 30) return true;
        //Reservation time should not be after 9:30 PM(21:30), return true if it is
        if (reservationHours > 21) return true;
        if (reservationHours === 21 && reservationMinutes > 30) return true;
        //return false
        return false;
    }

}



module.exports = {dayOfWeek, isReservationDatePast, isReservationTimePast, asDateString};