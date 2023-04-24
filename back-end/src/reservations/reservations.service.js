const knex = require("../db/connection");

function create(newReservation) {
    return knex("reservations").insert(newReservation).returning("*").then((createdRecords) => createdRecords[0]);
}

function list() {
    return knex("reservations").select("*").orderBy("reservation_time");
}

function listByDate(date) {
    return knex("reservations").select("*").where({ reservation_date: date }).whereNotIn("status", ["finished", "cancelled"]).orderBy("reservation_time");
}

function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id: reservation_id}).first();
}

async function update(updatedReservation) {
    return await knex("reservations").select("*").where({ reservation_id: updatedReservation.reservation_id }).update(updatedReservation, "*").then((updatedRecords) => updatedRecords[0]);
}

function search(mobile_number) {
    return knex("reservations")
    .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
    create,
    list,
    listByDate,
    read,
    update,
    search,
}