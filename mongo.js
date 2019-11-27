const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const MONGO_DB_NAME = 'orion';
const MONGO_URI = 'mongodb://localhost:27017/' + MONGO_DB_NAME;

const MONGO_CLIENT_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};

mongoose.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
const mongooseConnection = mongoose.connection;
mongooseConnection.on('error', function () {
  console.error('Mongoose connection error');
});
mongooseConnection.once('open', function () {
  console.log('Mongoose connection established!');
});



exports.retrieveDataFromTable = async function (tableName) {
  const client = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS).catch(err => {
    console.log(err);
  });

  try {
    let res = await client
      .db(MONGO_DB_NAME)
      .collection(tableName)
      .find()
      .toArray();

    return res;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};


exports.createCollection = async function (name, scheme, recordset) {
  let mongoScheme = {};

  for (let column of scheme) {
    mongoScheme[column['name']] = column['type'].substring(0, 1).toUpperCase() + column['type'].substring(1);
  }

  let dbSchema = new mongoose.Schema(mongoScheme, { collection: name });
  let model = mongoose.model(name, dbSchema);

  try {
    let collection = await model.createCollection();
    console.log(`Collection ${collection.name} has been created`);
    await model.insertMany(recordset);
    console.log(`${recordset.length} documents has been inserted`);
  }
  catch{
    console.error('Something went wrong during calling the "createCollection" function');
  }
}




