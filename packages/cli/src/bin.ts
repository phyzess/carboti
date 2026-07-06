#!/usr/bin/env node
import { runCarbotiCli } from "./index";

const exitCode = await runCarbotiCli(process.argv.slice(2));
process.exitCode = exitCode;
