import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { parse } from "node-html-parser";
import CatalogService from "./catalog";
import { download } from "./utils";

const prisma = new PrismaClient();

const syncCycle = async (catalogService) => {
  try {
    await fs.promises.mkdir("output");
  } catch (e) {}

  const catalogHTML = await catalogService.getCatalogHTML("g");
  const p = parse(catalogHTML);

  const selections = p.querySelectorAll("div.teaser");

  console.log("Found", selections.length, "threads");

  await selections.reduce(async (prev, link) => {
    await prev;

    if (link.textContent.includes("/sdg/")) {
      const thread = link.parentNode.querySelector("a");
      const href = thread.attrs.href;
      const threadUrl = `https:${href}`;
      const threadId = threadUrl.split("/").at(-1);
      const threadHtml = await catalogService.getUrl(threadUrl);
      const rawHtml = threadHtml.outerHTML;
      console.log("Visiting", threadId);
      if (rawHtml.includes("bump limit reached")) {
        const images = threadHtml.querySelectorAll("a.fileThumb");
        const exists = await prisma.thread.findFirst({
          where: { threadId: threadId },
        });
        if (!exists) {
          await images.reduce(async (prev, img) => {
            await prev;
            const imgUrl = `https:${img.attrs.href}`;
            const fileName = imgUrl.split("/").at(-1);
            console.log(
              "Downloading",
              "--",
              "thread ID",
              "--",
              threadId,
              "--",
              "file",
              fileName,
              "..."
            );
            await download(imgUrl, threadId, fileName);
            console.log("Done");
          }, Promise.resolve());

          await prisma.thread.create({
            data: {
              threadId: threadId,
            },
          });
          console.log("Downloaded thread", threadId);
        } else {
          console.log("Skipping", threadId, "--", "Already downloaded");
        }
      }
    }
  }, Promise.resolve());
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async () => {
  const catalogService = new CatalogService();
  await catalogService.initialize();
  while (true) {
    try {
      console.log("Starting sync cycle");
      await syncCycle(catalogService);
      console.log("Sleeping 5 minutes...");
      await delay(300000);
    } catch (e) {
      console.log(e);
    }
  }
};

main();
