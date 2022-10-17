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
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const fs = require("fs");
const http = require("http");
const https = require("https");
/**
 * Downloads file from remote HTTP[S] host and puts its contents to the
 * specified location.
 */
function download(url, threadId, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputDir = `output/${threadId}`;
        const filePath = `${outputDir}/${filename}`;
        try {
            yield fs.promises.mkdir(outputDir);
        }
        catch (e) { }
        const proto = !url.charAt(4).localeCompare("s") ? https : http;
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filePath);
            let fileInfo = null;
            const request = proto.get(url, (response) => {
                if (response.statusCode !== 200) {
                    fs.unlink(filePath, () => {
                        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                    });
                    return;
                }
                fileInfo = {
                    mime: response.headers["content-type"],
                    size: parseInt(response.headers["content-length"], 10),
                };
                response.pipe(file);
            });
            // The destination stream is ended by the time it's called
            file.on("finish", () => resolve(fileInfo));
            request.on("error", (err) => {
                fs.unlink(filePath, () => reject(err));
            });
            file.on("error", (err) => {
                fs.unlink(filePath, () => reject(err));
            });
            request.end();
        });
    });
}
exports.download = download;
