const healthCheck = 'health-check';
const loggerRoot = 'logger';
const baseRoutes = (root: string) => {
  return {
    root,
    getOne: `/${root}/:id`,
    update: `/${root}/:id`,
    delete: `/${root}/:id`,
    array: `/${root}/array`,
  };
};

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,

  healthCheck: {
    root: healthCheck,
  },
  sysCounter: {
    ...baseRoutes(`/sys-counter`),
  },
  product: {
    ...baseRoutes('products'),
  },
  //#region History
  apiLog: {
    root: 'api-logs',
  },
  logger: {
    ...baseRoutes(loggerRoot),
    connection: `/${loggerRoot}/connection`,
    latest: `/${loggerRoot}/latest`,
    byService: `/${loggerRoot}/service/:serviceName`,
    byLevel: `/${loggerRoot}/level/:level`,
    byDateRange: `/${loggerRoot}/date-range`,
    byMessage: `/${loggerRoot}/message/:message`,
    searchLog: `/${loggerRoot}/searchLog`,
  },
};
