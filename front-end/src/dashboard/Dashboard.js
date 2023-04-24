import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import TablesTable from "../tables/TablesTable";
import ReservationsTable from "../reservations/ReservationsTable";
import { useHistory } from "react-router";
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
  //const [dates, setDates] = useState(date);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();


  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    //console.log("LOAD DASHBOARD, Date", dates)
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    //load up tables section
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleClickPrevious = () => {
    date = previous(date)
    history.push(`/dashboard?date=${date}`);
  };

  const handleClickNext = () => {
    date = next(date)
    history.push(`/dashboard?date=${date}`);
  };

  const handleClickToday = () => {
    date = today()
    history.push(`/dashboard?date=${date}`);
  };

  const handleFinishClick = async (table) => {
    //const abortController = new AbortController();
    //"Is the table ready to seat new guests? This cannot be undone."
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
    //if user selects "Ok" then:
    //Send a 'DELETE' request to '/tables/:table_id/seat' to remove table assignment.
        updateReservationStatus("finished", table.reservation_id).catch(setTablesError);
        finishTable(table)
        .catch(setTablesError);
        //loadDashboard();
        window.location.reload();
    }
}

const handleReservationCancel = async (reservation) => {
  console.log("Hit Reservation Cancel!");
}

const reservationsFiltered = reservations.filter((reservation) => reservation.status !== "finished" );

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservation Date: {date}</h4>
      </div>

      <div className="d-md-flex mb-3">
        <button type="button" className="btn btn-dark btn-small" onClick={handleClickPrevious}>Previous</button>
        <button type="button" className="btn btn-light btn-small" onClick={handleClickToday}>Today</button>
        <button type="button" className="btn btn-dark btn-small" onClick={handleClickNext}>Next</button>
      </div>

      <ErrorAlert error={reservationsError} />
      <ReservationsTable reservations={reservationsFiltered} handleReservationCancel={handleReservationCancel}/>

      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <ErrorAlert error={tablesError} />
      <TablesTable tables={tables} handleFinishClick={handleFinishClick}/>
    </main>
  );
}

export default Dashboard;
