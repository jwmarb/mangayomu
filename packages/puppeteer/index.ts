import env from '@mangayomu/vercel-env';
import puppeteer from 'puppeteer';

export async function launchPuppeteer() {
  return puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${
      env().BROWSERLESS_API_TOKEN
    }&stealth`,
  });
}
