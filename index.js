#!/usr/bin/env node
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var yargs_1 = require("yargs");
var helpers_1 = require("yargs/helpers");
var key_settings_1 = require("./key-settings");
var openai_1 = require("./openai");
var argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option("setKey", { alias: "k", describe: "Set a new OpenAI Key" })
    .help()
    .parseSync();
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var key, userInput, command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, key_settings_1.default)(argv)];
                case 1:
                    key = _a.sent();
                    userInput = argv._.join(" ");
                    return [4 /*yield*/, (0, openai_1.default)(userInput, key)];
                case 2:
                    command = _a.sent();
                    if (!command) {
                        console.error("Something went wrong");
                        return [2 /*return*/, 1];
                    }
                    process.stdin.setRawMode(true);
                    process.stdin.resume();
                    process.stdin.setEncoding("utf8");
                    console.log("> ".concat(command, " [enter to run]"));
                    process.stdin.on("data", function (key) {
                        if (key.toString() === "\r" || key.toString() === "\n") {
                            process.stdin.setRawMode(false);
                            process.stdin.end();
                            var child_1 = (0, child_process_1.spawn)("sh", ["-c", "'".concat(command, "'")], {
                                stdio: "inherit",
                                detached: true, // This makes the child process the leader of a new process group
                                shell: true,
                            });
                            process.on("SIGINT", function () {
                                if (!child_1.pid)
                                    return;
                                // Forward SIGINT to the entire process group by using a negative PID
                                process.kill(-child_1.pid, "SIGINT");
                            });
                            child_1.on("close", function () {
                                process.exit(0);
                            });
                        }
                        else if (key) {
                            // User pressed any other key, cancel execution
                            console.error("Execution cancelled.");
                            process.exit(1);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
run();
