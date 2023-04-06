//Need to implement controller. 

let nextId = 1;
const tables = [];

async function create(req, res) {
    const newTable = req.body.data;

    const now = new Date().toISOString();
    newTable.table_id = nextId++;
    newTable.created_at = now;
    newTable.updated_at = now;

    tables.push(newTable);

    res.status(201).json({ data: newTable });
}

async function list(req, res) {
    res.json({ data: tables });
}

module.exports = {
    create,
    list,
}