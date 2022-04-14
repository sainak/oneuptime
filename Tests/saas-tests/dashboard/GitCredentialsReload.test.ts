import puppeteer from 'puppeteer';
import utils from '../../test-utils';
import init from '../../test-init';

let browser: $TSFixMe, page: $TSFixMe;
const user: $TSFixMe = {
    email: utils.generateRandomBusinessEmail(),
    password: '1234567890',
};
const gitUsername: $TSFixMe = utils.gitCredential.gitUsername;
const gitPassword: $TSFixMe = utils.gitCredential.gitPassword;

/** This is a test to check:
 * No errors on page reload
 * It stays on the same page on reload
 */

describe('OneUptime Page Reload', () => {
    const operationTimeOut: $TSFixMe = 100000;

    beforeAll(async (done: $TSFixMe) => {
        jest.setTimeout(100000);

        browser = await puppeteer.launch(utils.puppeteerLaunchConfig);
        page = await browser.newPage();

        await init.registerUser(user, page); // This automatically routes to dashboard page
        done();
    });

    afterAll(async (done: $TSFixMe) => {
        await browser.close();
        done();
    });

    test(
        'Should reload the probe page and confirm there are no errors',
        async (done: $TSFixMe) => {
            await page.goto(utils.DASHBOARD_URL, {
                waitUntil: ['networkidle2'],
            });

            await init.pageClick(page, '#projectSettings');

            await init.pageClick(page, '#more');

            await init.pageClick(page, '#gitCredentials');

            await init.pageClick(page, '#addCredentialBtn');

            await init.pageType(page, '#gitUsername', gitUsername);

            await init.pageType(page, '#gitPassword', gitPassword);

            await init.pageClick(page, '#addCredentialModalBtn');

            const spanElement: $TSFixMe = await init.pageWaitForSelector(
                page,
                `#gitUsername_${gitUsername}`
            );
            expect(spanElement).toBeDefined();
            //To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await init.pageWaitForSelector(page, '#cbProjectSettings', {
                visible: true,
                timeout: init.timeout,
            });
            await init.pageWaitForSelector(page, '#cbGitCredentials', {
                visible: true,
                timeout: init.timeout,
            });

            const spanElement2 = await init.pageWaitForSelector(
                page,
                `#gitUsername_${gitUsername}`
            );
            expect(spanElement2).toBeDefined();
            done();
        },
        operationTimeOut
    );
});
