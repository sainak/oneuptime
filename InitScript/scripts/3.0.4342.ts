import { find, update, save } from '../util/db';

const monitorCollection: string = 'monitors';
const projectsCollection: string = 'projects';
const incidentsCollection: string = 'incidents';
const incidentprioritiesCollection: string = 'incidentpriorities';

async function run(): void {
    const monitors: $TSFixMe = await find(monitorCollection, {
        pollTime: { $type: 'date' },
    });
    for (let i: $TSFixMe = 0; i < monitors.length; i++) {
        const monitor: $TSFixMe = monitors[i];
        await update(monitorCollection, { _id: monitor._id }, { pollTime: [] });
    }

    const incidentsWithoutIdNumber: $TSFixMe = await find(incidentsCollection, {
        idNumber: { $exists: false },
    });

    const projectIds: $TSFixMe = new Set();
    for (const incident of incidentsWithoutIdNumber) {
        projectIds.add(incident.projectId._id || incident.projectId);
    }

    //Update the incidents idNumber
    for (const projectId of projectIds) {
        const query: $TSFixMe = {
            projectId,
        };

        const incidents: $TSFixMe = await global.db
            .collection(incidentsCollection)
            .find(query)
            .sort('createdAt', 1)
            .toArray();
        for (let i: $TSFixMe = 0; i < incidents.length; i++) {
            await update(
                incidentsCollection,
                { _id: incidents[i]._id },
                { idNumber: i + 1 }
            );
        }
    }

    const allProjects: $TSFixMe = await find(projectsCollection, {
        deleted: false,
    });

    //Add default incident priorities for existing
    //projects not having any priority
    for (const project of allProjects) {
        const query: $TSFixMe = {
            projectId: project._id,
        };

        const incidentPriorities: $TSFixMe = await global.db
            .collection(incidentprioritiesCollection)
            .find(query)
            .toArray();
        if (incidentPriorities.length === 0) {
            await save(incidentprioritiesCollection, [
                {
                    deleted: false,
                    createdAt: new Date(),
                    projectId: project._id,
                    name: 'High',
                    color: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 1,
                    },
                },
                {
                    deleted: false,
                    createdAt: new Date(),
                    projectId: project._id,
                    name: 'Low',
                    color: {
                        r: 255,
                        g: 211,
                        b: 0,
                        a: 1,
                    },
                },
            ]);
        }
    }
}
export default run;
