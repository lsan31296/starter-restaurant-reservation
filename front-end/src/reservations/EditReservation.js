//Responsible for displaying the edit page of a particular reservations resource.

import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory, useParams } from "react-router";
import { getReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function EditReservation() {
    const [reservation, setReservation] = useState({});
    const [error, setError] = useState(null);
    const history = useHistory();
    const params = useParams();

    useEffect(loadReservation, [params.reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        getReservation(params.reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);
        return () => abortController.abort();
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        updateReservation(reservation, abortController.signal)
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
        return () => abortController.abort();
    };

    const handleChange = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.name === "people" ? parseInt(target.value) : target.value,
        });
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