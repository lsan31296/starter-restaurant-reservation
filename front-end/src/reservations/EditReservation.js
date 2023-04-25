//Responsible for displaying the edit page of a particular reservations resource.

import { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory, useParams } from "react-router";
import { getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function EditReservation() {
    const [reservation, setReservation] = useState({});
    const [error, setError] = useState(null);
    const history = useHistory();
    const params = useParams();

    useEffect(loadReservation, [params.reservation_id]);

    function loadReservation() {
        console.log("LOAD RESERVATION HIT");
        const abortController = new AbortController();
        getReservation(params.reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);
        return () => abortController.abort();
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Handle Submit Hit! Reservation:", reservation);
        /*
        createReservation(reservation)
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
        */
    };

    const handleChange = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.name === "people" ? parseInt(target.value) : target.value,
        });
        //console.log('Reservation:', reservation);
    };

    const handleCancel = () => {
        history.goBack();
    }

    return (
        <main>
            <h1>Edit Reservation</h1>
            <ErrorAlert error={error} />
            <ReservationForm reservation={reservation} handleCancel={handleCancel} handleChange={handleChange} handleSubmit={handleSubmit} />
        </main>
    )
}

export default EditReservation;