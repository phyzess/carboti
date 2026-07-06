import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import process from "node:process";
import { CarbotiApiError, CarbotiClient } from "@carboti/sdk";

export type CarbotiCliIo = {
  stderr: Pick<NodeJS.WriteStream, "write">;
  stdin: NodeJS.ReadStream;
  stdout: Pick<NodeJS.WriteStream, "write">;
};

export type CarbotiCliEnv = {
  CARBOTI_API_TOKEN?: string | undefined;
  CARBOTI_BASE_URL?: string | undefined;
};

export async function runCarbotiCli(
  argv: string[],
  env: CarbotiCliEnv = process.env,
  io: CarbotiCliIo = {
    stderr: process.stderr,
    stdin: process.stdin,
    stdout: process.stdout,
  },
): Promise<number> {
  const [command, ...args] = argv;
  try {
    switch (command) {
      case "init":
        return await runInit(args, env, io);
      case "ingest":
        return await runIngest(args, env, io);
      case "inspect":
        return await runInspect(args, env, io);
      case "replay":
        return await runReplay(args, env, io);
      case "export":
        return await runExport(args, env, io);
      case "--help":
      case "-h":
      case undefined:
        writeHelp(io);
        return 0;
      default:
        io.stderr.write(`Unknown command: ${command}\n\n`);
        writeHelp(io);
        return 1;
    }
  } catch (error) {
    writeCliError(io, error);
    return 1;
  }
}

async function runInit(args: string[], env: CarbotiCliEnv, io: CarbotiCliIo): Promise<number> {
  const flags = parseFlags(args);
  const baseUrl = flags["base-url"] ?? env.CARBOTI_BASE_URL ?? "http://localhost:8787";
  writeJson(io, {
    baseUrl,
    tokenEnv: "CARBOTI_API_TOKEN",
  });
  return 0;
}

async function runIngest(args: string[], env: CarbotiCliEnv, io: CarbotiCliIo): Promise<number> {
  const flags = parseFlags(args);
  const file = flags.file;
  const body = file ? await readFile(file) : await readStdin(io.stdin);
  const filename = flags.filename ?? (file ? basename(file) : undefined);
  const client = createClient(env, flags);
  const result = await client.ingestHttp({
    body: new Blob([toArrayBuffer(body)]),
    contentType: flags["content-type"] ?? "application/octet-stream",
    filename,
  });
  writeJson(io, result);
  return 0;
}

async function runInspect(args: string[], env: CarbotiCliEnv, io: CarbotiCliIo): Promise<number> {
  const [target, id, ...rest] = args;
  if (!target || !id) {
    throw new Error(
      "Usage: carboti inspect <object|artifact|message-artifacts|message-lineage> <id>",
    );
  }

  const flags = parseFlags(rest);
  const client = createClient(env, flags);
  const result =
    target === "object"
      ? await client.getObject(id)
      : target === "artifact"
        ? await client.getArtifact(id)
        : target === "message-artifacts"
          ? await client.listMessageArtifacts(id)
          : target === "message-lineage"
            ? await client.getMessageLineage(id)
            : null;
  if (!result) {
    throw new Error(
      "Inspect target must be object, artifact, message-artifacts, or message-lineage.",
    );
  }

  writeJson(io, result);
  return 0;
}

async function runReplay(args: string[], env: CarbotiCliEnv, io: CarbotiCliIo): Promise<number> {
  const [messageId, ...rest] = args;
  if (!messageId) throw new Error("Usage: carboti replay <messageId>");

  const flags = parseFlags(rest);
  const result = await createClient(env, flags).replayMessage(messageId);
  writeJson(io, result);
  return 0;
}

async function runExport(args: string[], env: CarbotiCliEnv, io: CarbotiCliIo): Promise<number> {
  const [target, id, ...rest] = args;
  if (target !== "artifact" || !id) {
    throw new Error("Usage: carboti export artifact <artifactId>");
  }

  const flags = parseFlags(rest);
  const result = await createClient(env, flags).getArtifact(id);
  writeJson(io, result);
  return 0;
}

function createClient(
  env: CarbotiCliEnv,
  flags: Record<string, string | undefined>,
): CarbotiClient {
  const baseUrl = flags["base-url"] ?? env.CARBOTI_BASE_URL;
  if (!baseUrl) throw new Error("Set CARBOTI_BASE_URL or pass --base-url.");

  const token = flags.token ?? env.CARBOTI_API_TOKEN;
  if (!token) throw new Error("Set CARBOTI_API_TOKEN or pass --token.");

  return new CarbotiClient({
    baseUrl,
    token,
  });
}

function parseFlags(args: string[]): Record<string, string | undefined> {
  const flags: Record<string, string | undefined> = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg?.startsWith("--")) continue;

    const equalsIndex = arg.indexOf("=");
    if (equalsIndex > -1) {
      flags[arg.slice(2, equalsIndex)] = arg.slice(equalsIndex + 1);
      continue;
    }

    const key = arg.slice(2);
    const next = args[index + 1];
    if (next && !next.startsWith("--")) {
      flags[key] = next;
      index += 1;
    } else {
      flags[key] = "true";
    }
  }
  return flags;
}

async function readStdin(stdin: NodeJS.ReadStream): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stdin) {
    chunks.push(typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk);
  }

  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function writeJson(io: CarbotiCliIo, value: unknown): void {
  io.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function writeHelp(io: CarbotiCliIo): void {
  io.stdout.write(`carboti <command>

Commands:
  init                                  Print local CLI configuration template
  ingest --file <path> [--filename n]   Ingest a file, or stdin when --file is omitted
  inspect object <id>                   Fetch object evidence
  inspect artifact <id>                 Fetch artifact evidence
  inspect message-artifacts <id>        List message artifacts
  inspect message-lineage <id>          Fetch message lineage
  replay <messageId>                    Replay processing from preserved raw input
  export artifact <artifactId>          Print artifact JSON

Flags:
  --base-url <url>                      Defaults to CARBOTI_BASE_URL
  --token <token>                       Defaults to CARBOTI_API_TOKEN
  --content-type <mime>                 Used by ingest
`);
}

function writeCliError(io: CarbotiCliIo, error: unknown): void {
  if (error instanceof CarbotiApiError) {
    io.stderr.write(`Carboti API error ${error.status} ${error.code}: ${error.message}\n`);
    return;
  }

  io.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
}
