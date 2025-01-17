process.env['SERVICE_NAME'] = 'ingress';

import logger from 'CommonServer/Utils/Logger';
import App from 'CommonServer/Utils/StartServer';
import { PostgresAppInstance } from 'CommonServer/Infrastructure/PostgresDatabase';
import FetchCertificateJobs from './Jobs/FetchCertificates';
import { PromiseVoidFunction } from 'Common/Types/FunctionTypes';
import InfrastructureStatus from 'CommonServer/Infrastructure/Status';

const APP_NAME: string = process.env['SERVICE_NAME'];

const init: PromiseVoidFunction = async (): Promise<void> => {
    try {
        const statusCheck: PromiseVoidFunction = async (): Promise<void> => {
            return await InfrastructureStatus.checkStatus({
                checkClickhouseStatus: false,
                checkPostgresStatus: true,
                checkRedisStatus: false,
            });
        };

        // init the app
        await App.init({
            appName: APP_NAME,
            port: undefined,
            isFrontendApp: false,
            statusOptions: {
                liveCheck: statusCheck,
                readyCheck: statusCheck,
            },
        });

        // connect to the database.
        await PostgresAppInstance.connect(
            PostgresAppInstance.getDatasourceOptions()
        );

        // init the jobs
        FetchCertificateJobs.init();

        // add default routes
        await App.addDefaultRoutes();
    } catch (err) {
        logger.error('App Init Failed:');
        logger.error(err);
        throw err;
    }
};

init().catch((err: Error) => {
    logger.error(err);
    logger.info('Exiting node process');
    process.exit(1);
});
