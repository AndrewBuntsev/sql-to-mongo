require('dotenv').config();

const transfer = require('./transfer');
const mssql = require('./mssql');
const mongo = require('./mongo');






(async function () {
    const tableName = 'StackItem';
    let recordset = await mssql.retrieveDataFromTable(tableName);
    let scheme = transfer.createScheme(recordset);
    mongo.createCollection(tableName, scheme, recordset);
})();
