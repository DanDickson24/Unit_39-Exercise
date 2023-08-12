const { BadRequestError } = require("../expressError");

// This function generates the necessary SQL clauses and values for performing partial updates in database queries.

// The function takes two arguments: dataToUpdate (an object containing the data to be updated) and jsToSql (a mapping of JavaScript keys to SQL column names).

// It first checks if there's any data to update by examining the keys of the dataToUpdate object. If there are no keys, it throws a BadRequestError with the message "No data."

// The function then generates an array of SQL clauses for each column to be updated using the keys.map function. It uses the jsToSql mapping to determine the appropriate SQL column name for each JavaScript key.

// Finally, the function returns an object containing the SQL setCols clause (columns to be updated) and an array of values to be updated.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
