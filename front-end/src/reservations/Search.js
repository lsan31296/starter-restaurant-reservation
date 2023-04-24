//Responsible for displaying a search box used to search for reservations with partial/complete phone number

import { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsTable from "../reservations/ReservationsTable";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
    const [mobile_number, setMobile_number] = useState("");
    const [error, setError] = useState(null);
    const [reservationsMobile, setReservationsMobile] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        listReservations({ mobile_number: mobile_number }).then((reservations) => setReservationsMobile(reservations)).catch(setError);
    };

    const handleChange = ({ target }) => {
        console.log("Target.value: ", target.value);
        setMobile_number(target.value);
    };

    return (
        <main>
            <h1>Search</h1>
            <form htmlFor="mobile_number" onSubmit={handleSubmit}>
                <div className="input-group mb-3" >
                    <input name="mobile_number" id="mobile_number" className="form-control" placeholder="Reservation Phone Number" type="text" required={true} onChange={handleChange} value={mobile_number} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">Find</button>
                    </div>
                </div>
            </form>

            <ErrorAlert error={error} />
            {reservationsMobile.length ? (
                <ReservationsTable reservations={reservationsMobile} />
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