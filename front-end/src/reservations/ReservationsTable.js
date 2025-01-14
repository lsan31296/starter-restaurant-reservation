//Displays the reservations table as seen in Dashboard.js
import React from "react";

function ReservationsTable({ reservations, handleReservationCancel }) {
    //will be adding 'Edit' button for US-08
    const tableRows = reservations.map((reservation) => (
        <tr key={reservation.reservation_id}>
            <th scope="row">{reservation.reservation_id}</th>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.people}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            <td className="btn-group" role="group" >
                {reservation.status === "booked" && (
                    <a href={`/reservations/${reservation.reservation_id}/seat`} type="button" className="btn btn-primary">Seat</a>
                )}
                <a href={`/reservations/${reservation.reservation_id}/edit`} type="button" className="btn btn-secondary">Edit</a>
                <button data-reservation-id-cancel={reservation.reservation_id} type="button" onClick={() => (handleReservationCancel(reservation))} className="btn btn-danger">Cancel</button>
            </td>
        </tr>
    ));

    return (
        <table className="table">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Reservation ID</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Party Size</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </table>
    );
}

export default ReservationsTable;