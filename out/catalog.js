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
exports.getUrl = exports.getCatalogHTML = void 0;
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const getCatalogHTML = (board) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.goto(`https://boards.4channel.org/${board}/catalog`);
    return yield page.evaluate(() => document.documentElement.outerHTML);
});
exports.getCatalogHTML = getCatalogHTML;
const getUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.goto(url);
    const html = yield page.evaluate(() => document.documentElement.outerHTML);
    return (0, node_html_parser_1.default)(html);
});
exports.getUrl = getUrl;
