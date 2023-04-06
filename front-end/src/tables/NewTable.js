import { useHistory } from "react-router";
import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

//Responsible for displaying a form for a new table

function NewTable() {
    const history = useHistory();
    const inifialFormState = {
        table_name: "",
        capacity: "",
    }

    const [table, setTable] = useState({...inifialFormState});
    const [error, setError] = useState(null);

    //handleSubmit actually needs to be implemented in 'api.js'
    const handleSubmit = (event) => {
        event.preventDefault();
        createTable(table)
        .then(() => {
            history.push("/dashboard")
        })
        .catch(setError);
    }

    const handleChange = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.name === "people" ? parseInt(target.value) : target.value,
        });
        console.log(table);
    }

    const handleCancel = () => {
        history.push("/");
    }

    return (
        <main>
            <h1>New Table</h1>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col form-group">
                        <label className="form-label" htmlFor="table_name">
                            Table Name
                        </label>
                        <input className="form-control" placeholder="Must be at least 2 characters long" id="table_name" name="table_name" value={table.table_name} onChange={handleChange} required={true} />
                    </div>
                    <div className="col form-group">
                        <label className="form-label" htmlFor="capacity">
                            Table Capacity
                        </label>
                        <input className="form-control" placeholder="Must be at least 1" id="capacity" name="capacity" value={table.capacity} onChange={handleChange} required={true} />
                    </div>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary mr-2">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </main>
    );
}

export default NewTable;