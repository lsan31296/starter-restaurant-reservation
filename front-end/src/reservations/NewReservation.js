//This file will be responsible for displaying a form used to submit a new reservation
import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function NewReservation() {
    const history = useHistory();
    const inifialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
        status: "booked",
    }
    const [reservation, setReservation] = useState({...inifialFormState});
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        
        createReservation(reservation, abortController.signal)
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
        history.push("/");
    }

    

    return (
        <main>
            <h1>New Reservation</h1>
            <ErrorAlert error={error} />
            <ReservationForm reservation={reservation} handleCancel={handleCancel} handleChange={handleChange} handleSubmit={handleSubmit} />
        </main>
    )
}

export default NewReservation;