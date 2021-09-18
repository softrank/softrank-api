module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'postgres',
  synchronize: true,
  entities: ['dist/modules/**/entities/*.entity.js'],
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration'
  }
}
