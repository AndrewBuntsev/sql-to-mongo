exports.createScheme = function (recordset) {
    if (recordset.length == 0) {
        console.log('No records found');
        return {};
    }

    let scheme = [];

    //First, collect information about all column types from the first record
    let record = recordset[0];
    for (let key in record) {
        if (record.hasOwnProperty(key)) {
            scheme.push({ name: key, type: (record[key] == null || record[key] == 'null') ? 'null' : typeof record[key] });
        }
    }

    //Then go through the rest of records and correct types
    for (let i = 1; i < recordset.length; i++) {
        record = recordset[i];
        for (let key in record) {
            if (record.hasOwnProperty(key)) {
                let schemeColumn = scheme.find(r => r.name == key);
                let columnType = (record[key] == null || record[key] == 'null') ? 'null' : typeof record[key];
                if (columnType != 'null' && columnType != schemeColumn.type) {
                    //console.log('type changed of + ' + key + '. schemeColumn.type = ' + schemeColumn.type + '..   columnType = ' + columnType + '    new value: ' + record[key]);
                    schemeColumn.type = columnType;
                }

            }
        }
    }

    //By this point, we have 3 types of 'types':  
    //1. 'normal' types (like string, number, boolean); 
    //2. null type - the column is NULL throughout the table, so let's use defaul type instead
    //3. object type - have to be examined deeply. let's suppose it is Date for now.

    //Get list of 'object' columns
    // let objectColumns = scheme.filter(c => c.type == 'object');
    //console.log(objectColumns);


    scheme.forEach(column => {
        if (column.type == 'null') {
            column.type = 'string';
        } else if (column.type == 'object') {
            column.type = 'date';
        }
    });

    return scheme;
}