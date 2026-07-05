import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const CIRCUITS_DIR = path.join(process.cwd(), "circuits");

export interface ProofOutput {
  proofData: string; // hex-encoded proof bytes
  publicInputs: string[]; // hex-encoded public inputs
  proofHash: string;
}

const USER_AGE = Number(process.env.USER_AGE) || 25;
const USER_TOKEN_BALANCE = Number(process.env.USER_TOKEN_BALANCE) || 500;
const USER_ADDRESS = process.env.USER_ADDRESS || "42";

export async function generateProof(
  ageThreshold: number,
  tokenThreshold: number
): Promise<ProofOutput> {
  const proverToml = [
    `age_threshold = "${ageThreshold}"`,
    `token_threshold = "${tokenThreshold}"`,
    `user_address = "${USER_ADDRESS}"`,
    `age = "${USER_AGE}"`,
    `token_balance = "${USER_TOKEN_BALANCE}"`,
  ].join("\n");

  fs.writeFileSync(path.join(CIRCUITS_DIR, "Prover.toml"), proverToml);

  execSync("nargo execute", { cwd: CIRCUITS_DIR, stdio: "pipe" });

  const output = execSync(
    `bb prove --bytecode_path target/agent_minima.json --witness_path target/agent_minima.gz -o ./target`,
    { cwd: CIRCUITS_DIR, stdio: "pipe" }
  ).toString();

  const proofHex = fs
    .readFileSync(path.join(CIRCUITS_DIR, "target/proof"))
    .toString("hex");

  const publicInputBytes = fs
    .readFileSync(path.join(CIRCUITS_DIR, "target/public_inputs"));

  const publicInputs = [];
  for (let i = 0; i < publicInputBytes.length; i += 32) {
    publicInputs.push("0x" + publicInputBytes.subarray(i, i + 32).toString("hex"));
  }

  const proofHash =
    "0x" +
    crypto
      .createHash("sha256")
      .update(Buffer.from(proofHex, "hex"))
      .digest("hex");

  return {
    proofData: "0x" + proofHex,
    publicInputs,
    proofHash,
  };
}
