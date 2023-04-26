const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const dateHelpers = require("./validationHelpers");
const reservationsService = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const data = mobile_number ? await reservationsService.search(mobile_number) : await reservationsService.listByDate(date);
  res.json({ data: data });
}

async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${req.params.reservation_id} cannot be found.` });
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function updateStatus(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const data = await reservationsService.update(updatedReservation);
  res.status(200).json({ data: data });
}

async function update(req, res) {
  const updatedReservation = {
    ...res.locals.reseervation,
    ...req.body.data,
  };
  const data = await reservationsService.update(updatedReservation);
  res.status(200).json({ data: data });
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "Data is missing!"});
}

function validateReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;

  if (reservation_date.match(/\d\d\d\d-\d\d-\d\d/)) {
    return next();
  }
  next({ status: 400, message: `reservation_date property must be an actual date, in the format: 'YYYY-MM-DD'.` })
}

function validateReservationDayOfWeek(req, res, next) {
  const { reservation_date } = req.body.data;
  const weekDay = dateHelpers.dayOfWeek(reservation_date);
  if (weekDay !== 2) {
    return next();
  }
  next({ status: 400, message: `Reservation has been set on a day we are closed, please select another date!` });
}

function validateFutureReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;
  const isReservationInThePast = dateHelpers.isReservationDatePast(reservation_date);
  if (!isReservationInThePast) {
    return next();
  }
  next({ status: 400, message: `Must reserve on a date in the future.` });
}

function validateFutureReservationTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const isReservationTimeInThePast = dateHelpers.isReservationTimePast(reservation_date, reservation_time);
  if (!isReservationTimeInThePast) {
    return next();
  }
  next({ status:400, message: `Reservation must be for a future date/time between 10:30 AM and 9:30PM.`});
}

function validateReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time.match(/\d\d:\d\d/)) {
    return next();
  }
  next({ status: 400, message: `reservation_time property must be an actual time, in the format: 'HH:MM'.` })
}
function validatePeople(req, res, next) {
  const { people } = req.body.data;
  
  if (typeof(people) === 'number' && people > 0) {
    return next();
  }
  next({ status: 400, message: `people property must be a number greater than zero.` });
}

const requiredProperties = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

//Will check if any property is either missing or empty
const hasRequiredProperties = hasProperties(...requiredProperties);


async function create(req, res) {
  const newReservation = await reservationsService.create({
    ...req.body.data,
    status: "booked",
  });

  res.status(201).json({ data: newReservation });
}

function validateStatusIsBooked(req, res, next) {
  //returns 201 is status is booked. 400 for 'seated' or 'finished'
  const { status } = req.body.data;
  if (status && status !== "booked") return next({ status: 400, message: `The reservation status must be 'booked' when creating/updating, currently status is '${status}'.` });
  next();
}

const VALIDSTATUS = [ "booked", "seated", "finished", "cancelled" ];

function validateStatusIsKnownAndUnfinished(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;
  //console.log(`Request: ${status}`);
  //console.log(`Current reservation status: ${res.locals.reservation.status}`);
  if (VALIDSTATUS.includes(status) && currentStatus !== "finished") return next();
  next({ status: 400, message: `You requested to change current status: ${currentStatus} to: '${status}'. Requested status must be known and not currently finished.` });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasData,
    hasRequiredProperties,
    validateReservationDate,
    validateFutureReservationDate,
    validateReservationDayOfWeek,
    validateReservationTime,
    validateFutureReservationTime,
    validatePeople,
    validateStatusIsBooked,
    asyncErrorBoundary(create)
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    read,
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validateStatusIsKnownAndUnfinished,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validateReservationDate,
    validateFutureReservationDate,
    validateReservationDayOfWeek,
    validateReservationTime,
    validateFutureReservationTime,
    validatePeople,
    validateStatusIsBooked,
    asyncErrorBoundary(update),
  ],
};
