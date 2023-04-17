//Responsible for displaying the tables table on Dashboard
import React from "react";
import { finishTable } from "../utils/api";

function TablesTable({ tables, loadDashboard, setError}) {
    const handleFinishClick = async (table_id) => {
        //const abortController = new AbortController();
        //"Is the table ready to seat new guests? This cannot be undone."
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
        //if user selects "Ok" then:
        //Send a 'DELETE' request to '/tables/:table_id/seat' to remove table assignment.
            finishTable(table_id)
                .catch(setError);
            window.location.reload();
        }
    }

    const rows = tables.map((table) => (
        <tr key={table.table_id}>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>
                {table.reservation_id ? "Occupied" : "Free"}
            </td>
            {
                table.reservation_id &&
                <td><button data-table-id-finish={table.table_id} type="button" className="btn btn-primary" onClick={() => handleFinishClick(table.table_id)}>Finish</button></td>
            }
        </tr>
    ));

    return (
        <table className="table">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Table ID</th>
                    <th scope="col">Table Name</th>
                    <th scope="col">Capacity</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default TablesTable;