import { find, update } from '../util/db';
import getSlug from '../util/getSlug';
const errortrackerCollection: string = 'errortrackers';

async function run(): void {
    const errorTrackers: $TSFixMe = await find(errortrackerCollection, {
        $or: [
            { slug: { $exists: false } },
            { slug: { $regex: /[&*+~.,\\/()|'"!:@]+/g } },
        ],
    });
    for (let i: $TSFixMe = 0; i < errorTrackers.length; i++) {
        const { name }: $TSFixMe = errorTrackers[i];
        errorTrackers[i].slug = getSlug(name);
        await update(
            errortrackerCollection,
            { _id: errorTrackers[i]._id },
            { slug: errorTrackers[i].slug }
        );
    }
    return `Script ran for ${errorTrackers.length} errorTrackers.`;
}
export default run;
