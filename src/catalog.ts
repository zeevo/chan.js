import parse from "node-html-parser";
import puppeteer from "puppeteer";

export const getCatalogHTML = async (board: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://boards.4channel.org/${board}/catalog`);
  return await page.evaluate(() => document.documentElement.outerHTML);
};

export const getUrl = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  return parse(html);
};
