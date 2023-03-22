const { BadRequestError } = require("../expressError");

// this function will prep the data for SQL update statement

function sqlForPartialUpdate(data, jsToSql) {
    const keys = Object.keys(data);
    if (keys.length===0) throw new BadRequestError("No data");

    // {firstName: 'Erik', lastName: 'Richard'} => ['"first_name"=$1, '"lastName"=$2']
    const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}" = $${idx+1}`);

    return {
        setCols: cols.join(", "),
        values: Object.values(data)
    }
}

module.exports = {sqlForPartialUpdate};