import { SERVER_PORT } from './constants';
import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { createSubLogger } from './logger';
import { endpointNotFound, errorHandler } from './middlewares/error-handling';
import userRoute from './routes/user.route';
import { authGuard } from './middlewares/auth';
import { initDb } from './services/database';

const app: Express = express();
const logger = createSubLogger('app');

app.use(cors());
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

app.get('/', (req, res) => {
  res.json({
    app: process.env.npm_package_name,
    apiVersion: process.env.npm_package_version,
    env: process.env.NODE_ENV,
  });
});

app.use('/api/v1/users', authGuard, userRoute);

app.use(endpointNotFound);
app.use(errorHandler);

const server = createServer(app);
server.listen(SERVER_PORT, async () => {
  await initDb();
  if (process.env.NODE_ENV === 'production') {
    logger.info(`server listening on port: ${SERVER_PORT}`);
  } else {
    logger.info(`development server listening at http://localhost:${SERVER_PORT}`);
  }
});

async function shutdownHook() {
  try {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      }),
    );
  } catch (err) {
    logger.warn({ error: err }, 'server closed with errors');
  }
}

process.on('SIGINT', shutdownHook);
process.on('SIGTERM', shutdownHook);
