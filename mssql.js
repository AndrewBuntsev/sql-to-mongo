const sql = require('mssql');

const CONNECTION_STRING = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  dateStrings: true
};

exports.retrieveDataFromTable = async function (tableName, number) {
  let conn = new sql.ConnectionPool(CONNECTION_STRING);
  try {
    await conn.connect();
    let request = new sql.Request(conn);
    let recordset = await request.query(`select ${number ? 'top ' + number : ''} * from ${tableName}`).then(data => data.recordset);
    return recordset;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    conn.close();
  }
}
