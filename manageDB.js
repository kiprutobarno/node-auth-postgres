require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
  console.log("....connected to database....");
});

/** Create users table */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users(
                        id UUID PRIMARY KEY, 
                        firstName VARCHAR(30) NOT NULL,
                        lastName VARCHAR(30) NOT NULL,
                        email VARCHAR(50) UNIQUE NOT NULL,
                        password VARCHAR(100) NOT NULL,
                        dateCreated TIMESTAMP,
                        dateModified TIMESTAMP)`;
  pool
    .query(queryText)
    .then(results => {
      console.log("....users table succcessfully created....");
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

/** Create users table */
const createActivitiesTable = () => {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS activities(
                        id UUID PRIMARY KEY, 
                        activityName VARCHAR(300) NOT NULL,
                        ownerId UUID REFERENCES users(id) ON DELETE CASCADE,
                        dateCreated TIMESTAMP,
                        dateModified TIMESTAMP)`;
  pool
    .query(createTableQuery)
    .then(results => {
      console.log("....activities table succcessfully created....");
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

/**Drop users table */
const dropUsersTable = () => {
  const dropTableQuery = `DROP TABLE IF EXISTS users`;
  pool
    .query(dropTableQuery)
    .then(results => {
      console.log("....users table succcessfully dropped....");
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

const dropActivitiesTable = () => {
  const dropTableQuery = `DROP TABLE IF EXISTS activities`;
  pool
    .query(dropTableQuery)
    .then(results => {
      console.log("....activities table succcessfully dropped....");
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

pool.on("remove", () => {
  process.exit(0);
});

module.exports = {
  createUsersTable,
  dropUsersTable,
  createActivitiesTable,
  dropActivitiesTable
};

require("make-runnable");
