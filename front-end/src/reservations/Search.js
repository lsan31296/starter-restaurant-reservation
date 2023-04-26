//Responsible for displaying a search box used to search for reservations with partial/complete phone number

import React, { useState } from "react";
import { listReservations, updateReservationStatus } from "../utils/api";
import ReservationsTable from "../reservations/ReservationsTable";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
    const [mobile_number, setMobile_number] = useState("");
    const [error, setError] = useState(null);
    const [reservationsMobile, setReservationsMobile] = useState([]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        listReservations({ mobile_number: mobile_number }).then((reservations) => setReservationsMobile(reservations)).catch(setError);
    };

    const handleSearchChange = ({ target }) => {
        setMobile_number(target.value);
    };

    const handleReservationCancel = async (reservation) => {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            await updateReservationStatus("cancelled", reservation.reservation_id);
            window.location.reload();
        }
    }

    return (
        <main>
            <h1>Search</h1>
            <form htmlFor="mobile_number" onSubmit={handleSearchSubmit}>
                <div className="input-group mb-3" >
                    <input name="mobile_number" id="mobile_number" className="form-control" placeholder="Reservation Phone Number" type="text" required={true} onChange={handleSearchChange} value={mobile_number} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">Find</button>
                    </div>
                </div>
            </form>

            <ErrorAlert error={error} />
            {reservationsMobile.length ? (
                <ReservationsTable reservations={reservationsMobile} handleReservationCancel={handleReservationCancel}/>
            )
            :
            (
                <div className="d-md-flex mb-3">
                    <p>No reservations found</p>
                </div>
            )
            }
            

        </main>
    )
}

export default Search;