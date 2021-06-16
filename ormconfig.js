module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'root',
  password: 'root',
  database: 'SRK',
  synchronize: true,
  entities: ['dist/modules/**/entities/*.entity.js'],
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration'
  }
}
