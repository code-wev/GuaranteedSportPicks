import express, { Application } from 'express';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import morgan from 'morgan';
import config from './config/config';
import PathNotFound from './helpers/responses/path-not-found';
import { webhook } from './modules/subscription/subscription.controller';
import { loggerStream } from './utils/logger/logger';

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const WHITE = '\x1b[37m';
const RESET = '\x1b[0m';

const app: Application = express();
let databaseConnectionPromise: Promise<typeof mongoose> | null = null;

const publicDirPath = path.join(__dirname, '..', 'public');

app.post('/api/v1/subscription/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(express.json({ limit: config.MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: config.URL_ENCODED }));
app.use(cookieParser());
app.use(fileUpload(config.EXPRESS_FILE_UPLOAD_CONFIG));

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3000/',
      'https://guaranteed-sport-picks.vercel.app',
      'https://guaranteed-sport-picks.vercel.app/',
    ],
    credentials: true,
  })
);

app.use(helmet());
app.use((req: any, res: any, next: any) => {
  const sanitizer = (mongoSanitize as any).sanitize || ((obj: any) => obj);

  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (req[key]) {
      const target = sanitizer(req[key]);

      try {
        req[key] = target;
      } catch (err) {
        if (typeof req[key] === 'object' && req[key] && typeof target === 'object' && target) {
          Object.keys(req[key]).forEach((k) => delete req[key][k]);
          Object.keys(target).forEach((k) => {
            req[key][k] = target[k];
          });
        }
      }
    }
  });

  next();
});

app.use(hpp());
app.use(morgan('dev'));
app.use(morgan('combined', { stream: loggerStream }));

app.use(
  rateLimit({
    windowMs: config.REQUEST_LIMIT_TIME,
    max: config.NODE_ENV !== 'production' ? Infinity : config.REQUEST_LIMIT_NUMBER,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(
  express.static(publicDirPath, {
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

const routes: {
  module: string;
  path: string;
  method: string;
  time: number;
}[] = [];

const loadRoutes = (basePath: string, baseRoute: string) => {
  if (!fs.existsSync(basePath)) {
    return;
  }

  fs.readdirSync(basePath).forEach((item: string) => {
    const itemPath = path.join(basePath, item);
    const start = performance.now();

    if (fs.statSync(itemPath).isDirectory()) {
      loadRoutes(itemPath, `${baseRoute}/${item.replace('.route', '')}`);
      return;
    }

    if (!item.endsWith('.route.ts') && !item.endsWith('.route.js')) {
      return;
    }

    const routeModule = require(itemPath);
    const router = routeModule.default || routeModule;
    app.use(baseRoute, router);

    if (config.NODE_ENV !== 'production') {
      const end = performance.now();

      router.stack.forEach((layer: any) => {
        if (!layer.route) {
          return;
        }

        Object.keys(layer.route.methods).forEach((method) => {
          routes.push({
            module: item.split('.')[0],
            path: `${baseRoute}${layer.route.path}`,
            method: method.toUpperCase(),
            time: end - start,
          });
        });
      });
    }
  });
};

const routesPath = path.join(__dirname, 'modules');
loadRoutes(routesPath, '/api/v1');

app.use(PathNotFound);

const getFormattedDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
};

const getFormattedTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0'
  )}:${String(now.getSeconds()).padStart(2, '0')}`;
};

function logRoutesByModule() {
  const grouped: Record<string, any[]> = {};

  routes.forEach((route) => {
    if (!grouped[route.module]) grouped[route.module] = [];
    grouped[route.module].push(route);
  });

  Object.entries(grouped).forEach(([module, routeList]) => {
    console.log(
      `${YELLOW}======================= ${module.toUpperCase()} =======================${RESET}\n`
    );

    routeList.forEach((route: any) => {
      const info = `${GREEN}${route.method} ${route.path} - ${YELLOW}${route.time.toFixed(
        2
      )} ms${RESET}`;

      console.log(
        `${GREEN}[Express] ${WHITE}${getFormattedDate()} ${getFormattedTime()} ${GREEN}LOG ${YELLOW}[RouterExplorer] ${info}${RESET}`
      );
    });

    console.log(`\n${YELLOW}======================== END ========================${RESET}\n`);
  });
}

export const connectToDatabase = async () => {
  if (!databaseConnectionPromise) {
    databaseConnectionPromise = mongoose.connect(config.DB_CONNECTION_URI);
  }

  return databaseConnectionPromise;
};

export const initializeApp = async () => {
  await connectToDatabase();
  return app;
};

const startServer = async () => {
  await connectToDatabase();

  app.listen(config.PORT, () => {
    console.log(
      `${GREEN}Connected to MongoDB successfully.${RESET}\n`,
      `${GREEN}Connected to Redis successfully.${RESET}\n`,
      `${BLUE}Server Details:${RESET}\n`,
      `Base URL: ${YELLOW}${config.BASE_URL}:${config.PORT}${RESET}\n`,
      `Environment: ${YELLOW}${config.NODE_ENV}${RESET}\n`,
      `Port: ${YELLOW}${config.PORT}${RESET}\n`
    );
    console.log(`Server is running at ${config.BASE_URL}:${config.PORT} in ${config.NODE_ENV} mode.`);
    logRoutesByModule();
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;
