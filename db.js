const mysql = require('mysql2')
const { config } = require('./config')

function connectMysql(databaseName) {
  const connection = mysql.createConnection(config)

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err)
      return
    }
    console.log('Connected to the database.')

    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`

    connection.query(createDbQuery, (error, results, fields) => {
      if (error) throw error

      console.log('Database created successfully')

      connection.end()
    })
  })
}

function connectDatabase(databaseName) {
  const pool = mysql.createPool({
    ...config,
    database: databaseName
  })

  return pool.promise()
}

async function createTable(tableName) {
  const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `

  try {
    await db.query(createUsersTableQuery)
    console.log(`Table ${tableName} created successfully.`)
  } catch (error) {
    console.error('Error creating table:', error)
  }
}

module.exports = {
  connectMysql,
  connectDatabase,
  createTable
}
