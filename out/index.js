"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const node_html_parser_1 = require("node-html-parser");
const catalog_1 = require("./catalog");
const utils_1 = require("./utils");
const prisma = new client_1.PrismaClient();
const syncCycle = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.default.promises.mkdir("output");
    }
    catch (e) { }
    const catalogHTML = yield (0, catalog_1.getCatalogHTML)("g");
    const p = (0, node_html_parser_1.parse)(catalogHTML);
    const selections = p.querySelectorAll("div.teaser");
    console.log("Found", selections.length, "threads");
    yield selections.reduce((prev, link) => __awaiter(void 0, void 0, void 0, function* () {
        yield prev;
        if (link.textContent.includes("/sdg/")) {
            const thread = link.parentNode.querySelector("a");
            const href = thread.attrs.href;
            const threadUrl = `https:${href}`;
            const threadId = threadUrl.split("/").at(-1);
            const threadHtml = yield (0, catalog_1.getUrl)(threadUrl);
            const rawHtml = threadHtml.outerHTML;
            if (rawHtml.includes("bump limit reached")) {
                const images = threadHtml.querySelectorAll("a.fileThumb");
                const exists = yield prisma.thread.findFirst({
                    where: { threadId: threadId },
                });
                if (!exists) {
                    images.reduce((prev, img) => __awaiter(void 0, void 0, void 0, function* () {
                        yield prev;
                        const imgUrl = `https:${img.attrs.href}`;
                        const fileName = imgUrl.split("/").at(-1);
                        console.log("Downloading", "--", "thread ID", "--", threadId, "--", "file", fileName, "...");
                        yield (0, utils_1.download)(imgUrl, threadId, fileName);
                        console.log("Done");
                    }), Promise.resolve());
                    yield prisma.thread.create({
                        data: {
                            threadId: threadId,
                        },
                    });
                    console.log("Downloaded thread", threadId);
                }
                else {
                    console.log("Skipping", threadId, "--", "Already downloaded");
                }
            }
        }
    }), Promise.resolve());
});
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        console.log("Starting sync cycle");
        yield syncCycle();
        console.log("Sleeping 5 minutes...");
        yield delay(300000);
    }
});
main();
