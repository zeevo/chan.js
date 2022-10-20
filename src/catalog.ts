import parse from "node-html-parser";
import puppeteer from "puppeteer";

export default class CatalogService {
  browser: puppeteer.Browser;

  async initialize() {
    this.browser = await puppeteer.launch();
  }

  async getCatalogHTML(board: string) {
    const page = await this.browser.newPage();
    await page.goto(`https://boards.4channel.org/${board}/catalog`);
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    await page.close();
    return html;
  }

  async getUrl(url) {
    const page = await this.browser.newPage();
    await page.goto(url);
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    await page.close();
    return parse(html);
  }
}
