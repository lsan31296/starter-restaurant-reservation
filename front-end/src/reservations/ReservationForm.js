//Responsible for displaying form for creating/updating reservation
import React from "react";

function ReservationForm({ reservation, handleCancel, handleChange, handleSubmit }) {

    return (
        <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col form-group">
                <label className="form-label" htmlFor="first_name">
                    First Name
                </label>
                <input className="form-control" id="first_name" name="first_name" value={reservation.first_name} onChange={handleChange} required={true} />
            </div>
            <div className="col form-group">
                <label className="form-label" htmlFor="last_name">
                    Last Name
                </label>
                <input className="form-control" id="last_name" name="last_name" value={reservation.last_name} onChange={handleChange} required={true} />
            </div>
        </div>
        <div className="row">
            <div className="col form-group">
                <label className="form-label" htmlFor="people">
                    Party Size
                </label>
                <input className="form-control" id="people" name="people" type="number" value={reservation.people} onChange={handleChange} required={true} />
            </div>
            <div className="col form-group">
                <label className="form-label" htmlFor="mobile_number">
                    Mobile Number
                </label>
                <input className="form-control" id="mobile_number" name="mobile_number" value={reservation.mobile_number} onChange={handleChange} required={true} />
            </div>
        </div>
        <div className="row">
            <div className="col form-group">
                <label className="form-label" htmlFor="reservation_date">
                    Reservation Date
                </label>
                <input type="date" name="reservation_date" id="reservation_date" className="form-control" onChange={handleChange} value={reservation.reservation_date} placeholder="YYYY-MM-DD"  pattern="\d{4}-\d{2}-\d{2}" required={true} />
            </div>
            <div className="col form-group">
                <label className="form-label" htmlFor="reservation_time">
                    Reservation Time
                </label>
                <input type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" name="reservation_time" id="reservation_time" className="form-control" onChange={handleChange} value={reservation.reservation_time} required={true} />
            </div>
        </div>
        <div>
            <button type="submit" className="btn btn-primary mr-2">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
    );
}

export default ReservationForm;