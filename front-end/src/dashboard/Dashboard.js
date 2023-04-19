import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import TablesTable from "../tables/TablesTable";
//import { useSearchParams } from "react-router-dom";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [dates, setDates] = useState(date);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [dates]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ reservation_date: dates }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    //load up tables section
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleClickPrevious = () => {
    setDates(previous(dates));
  };

  const handleClickNext = () => {
    setDates(next(dates));
  };

  const handleClickToday = () => {
    setDates(today());
  };

  const handleFinishClick = async (table) => {
    //const abortController = new AbortController();
    //"Is the table ready to seat new guests? This cannot be undone."
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
    //if user selects "Ok" then:
    //Send a 'DELETE' request to '/tables/:table_id/seat' to remove table assignment.
        //updateReservationStatus("finished", table.reservation_id).catch(setTablesError);
        finishTable(table).then(() => {
            loadDashboard()
        })
        .catch(setTablesError);
        //window.location.reload();
    }
}
  
  const reservationsFiltered = reservations.filter((reservation)=> reservation.reservation_date === dates && reservation.reservation_status !== "finished");

  const tableRows = reservationsFiltered.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.people}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
      {reservation.status === "booked" && (
        <td><a href={`/reservations/${reservation.reservation_id}/seat`} role="button" className="btn btn-primary">Seat</a></td>
      )}
    </tr>
  ));

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations: {dates}</h4>
      </div>
      <div className="d-md-flex mb-3">
        <button type="button" className="btn btn-dark btn-small" onClick={handleClickPrevious}>Previous</button>
        <button type="button" className="btn btn-light btn-small" onClick={handleClickToday}>Today</button>
        <button type="button" className="btn btn-dark btn-small" onClick={handleClickNext}>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
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

      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <ErrorAlert error={tablesError} />
      <TablesTable tables={tables} loadDashboard={loadDashboard} setError={setTablesError} handleFinishClick={handleFinishClick}/>
    </main>
  );
}

export default Dashboard;
