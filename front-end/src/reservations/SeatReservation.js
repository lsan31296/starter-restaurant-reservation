//Form responsible for seating the reservation
import React, {useEffect, useState} from "react";
import { listTables, seatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router";

function SeatReservation() {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    const [chosenTableId, setChosenTableId] = useState();
    const history = useHistory();
    const params = useParams();

    useEffect(loadTables, []);

    function loadTables() {
        const abortController = new AbortController();
        setError(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setError)
        return () => abortController.abort();
    }

    const handleChange = ({ target }) => {
        setChosenTableId(target.value)
    }

    const handleCancel = () => {
        history.push("/");
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        seatTable(chosenTableId, params.reservation_id)
            .then(() => history.push("/"))
            .catch(setError);
    }

    console.log(chosenTableId);

    return (
        <main>
            <h1>Seat Reservation</h1>
            <ErrorAlert error={error} />
            <div className="input-group d-md-flex my-3">
                <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="tables">Tables</label>
                </div>
                <select className="custom-select" name="table_id" id="tables" value={chosenTableId} onChange={handleChange} required={true}>
                    <option >Choose a Table...</option>
                    {tables.map((table) => {
                        return <option key={table.table_id} value={table.table_id}>{`${table.table_name} - ${table.capacity}`}</option>
                    })}
                </select>
                <div>
                    <button type="submit" className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </main>
    );
}

export default SeatReservation;