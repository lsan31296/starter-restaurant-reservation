//Responsible for displaying the tables table on Dashboard
import React from "react";

function TablesTable({ tables, loadDashboard, setError, handleFinishClick}) {

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
                <td><button data-table-id-finish={table.table_id} type="button" className="btn btn-primary" onClick={() => handleFinishClick(table)}>Finish</button></td>
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