//Need to implement controller. 
const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsService = require("../reservations/reservations.service");

async function create(req, res) {
    const newTable = await service.create(req.body.data);
    res.status(201).json({ data: newTable });
}

async function list(req, res) {
    const data = await service.list();
    res.json({ data });
}

async function destroy(req, res) {
    const updatedTable = {
        ...res.locals.table,
        reservation_id: null,
    }
    await service.destroy(updatedTable);
    res.sendStatus(200);
}

async function seatReservation(req, res) {
    const updatedTable = {
        ...req.body.data,
        table_id: res.locals.table.table_id,
    };
    const table = await service.update(updatedTable);
    res.status(200).json({ data: table });
}

async function tableExists(req, res, next) {
    const table = await service.read(req.params.table_id);
    if (table) {
        res.locals.table = table;
        return next();
    }
    next({ status: 404, message: `Table ${req.params.table_id} cannot be found.` });
}

async function reservationExists(req, res, next) {
    const reservation = await reservationsService.read(req.body.data.reservation_id);
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    next({ status: 404, message: `The reservation_id: ${req.body.data.reservation_id} associated with this table does not exist.` });
}

function hasData(req, res, next) {
    if (req.body.data) {
        return next();
    }
    next({ status: 400, message: `Table data is missing!`});
}

const requiredPostProperties = ["table_name", "capacity"];
const hasRequiredPostProperties = hasProperties(...requiredPostProperties);

//returns 400 if table_name isn't greater than 1
function validateTableName(req, res, next) {
    const { table_name } = req.body.data;
    if (table_name.length > 1) {
        return next();
    }
    next({ status: 400, message: `The table_name must be greater than one character in length.`});
}

function validateCapacity(req, res, next) {
    const { capacity } = req.body.data;
    if ( typeof(capacity) === 'number' && capacity > 0) {
        return next();
    }
    next({ status: 400, message: `The capacity property must be a number greater than zero.` });
}

const hasReservationId = hasProperties(["reservation_id"]);

function resExceedsCapacity(req, res, next) {
    if (res.locals.reservation.people <= res.locals.table.capacity) {
        return next();
    }
    next({ status: 400, message: `This reservation of '${res.locals.reservation.people}' exceeds the tables' capacity of '${res.locals.table.capacity}'` });
}

function tableIsOccupied(req, res, next) {
    if (res.locals.table.reservation_id) {
        return next({ status: 400, message: `This table is already occupied by another reservation.` });
    }
    next();
}

function tableIsNotOccupied(req, res, next) {
    if (res.locals.table.reservation_id) {
        return next();
    }
    next({ status: 400, message: `This table is not occupied by another reservation.` });
}

module.exports = {
    create: [ hasData, hasRequiredPostProperties, validateTableName, validateCapacity, asyncErrorBoundary(create) ],
    list,
    update: [ hasData, asyncErrorBoundary(tableExists), hasReservationId, asyncErrorBoundary(reservationExists), resExceedsCapacity, tableIsOccupied, asyncErrorBoundary(seatReservation)],
    destroy: [ asyncErrorBoundary(tableExists), tableIsNotOccupied, asyncErrorBoundary(destroy) ],
}