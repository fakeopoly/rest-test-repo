import { Knex, knex } from 'knex';
import { createSubLogger } from '../logger';
import * as process from 'process';

const logger = createSubLogger('database');

const config: Knex.Config = {
  client: 'sqlite3',
  debug: process.env.NODE_ENV === 'development',
  useNullAsDefault: true,
  connection: {
    filename: './data.db',
  },
  pool: {
    min: 1,
    max: 5,
  },
};

const knexInstance = knex(config);

export async function initDb() {
  try {
    if (await knexInstance.schema.hasTable('users')) {
      return;
    }

    // setup db
    await knexInstance.schema.createTable('users', (table) => {
      table.increments('id');
      table.string('name', 100).notNullable().unique();
      table.integer('age').notNullable();
      table.boolean('active').notNullable();
      table.string('email', 100);
    });

    logger.info('db setup complete');
  } catch (err) {
    logger.error(err, 'failed db setup');
    process.exit(1);
  }
}

export default knexInstance;
