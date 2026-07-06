import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export interface ProofOutput {
  proofData: string;
  publicInputs: string[];
  proofHash: string;
}

const PROVER_URL = process.env.PROVER_URL || "";
const CIRCUITS_DIR = path.join(process.cwd(), "circuits");
const PROOFS_DIR = path.join(process.cwd(), "data", "proofs");

export async function generateProof(
  ageThreshold: number,
  tokenThreshold: number,
): Promise<ProofOutput> {
  if (PROVER_URL) {
    return generateProofRemote(ageThreshold, tokenThreshold);
  }

  const hasCircuit = fs.existsSync(
    path.join(CIRCUITS_DIR, "target", "agent_minima.json"),
  );
  if (hasCircuit) {
    return generateProofLocal(ageThreshold, tokenThreshold);
  }

  return getCachedProof(ageThreshold, tokenThreshold);
}

async function generateProofRemote(
  ageThreshold: number,
  tokenThreshold: number,
): Promise<ProofOutput> {
  const res = await fetch(`${PROVER_URL}/prove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ageThreshold, tokenThreshold }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Prover service error ${res.status}: ${text}`);
  }

  return res.json();
}

const NARGO = process.env.NARGO_PATH || "nargo";
const BB = process.env.BB_PATH || "bb";
const USER_AGE = Number(process.env.USER_AGE) || 25;
const USER_TOKEN_BALANCE = Number(process.env.USER_TOKEN_BALANCE) || 500;
const USER_ADDRESS = process.env.USER_ADDRESS || "42";

function generateProofLocal(
  ageThreshold: number,
  tokenThreshold: number,
): ProofOutput {
  const proverToml = [
    `age_threshold = "${ageThreshold}"`,
    `token_threshold = "${tokenThreshold}"`,
    `user_address = "${USER_ADDRESS}"`,
    `age = "${USER_AGE}"`,
    `token_balance = "${USER_TOKEN_BALANCE}"`,
  ].join("\n");

  fs.writeFileSync(path.join(CIRCUITS_DIR, "Prover.toml"), proverToml);

  execSync(`${NARGO} execute`, { cwd: CIRCUITS_DIR, stdio: "pipe" });

  execSync(
    `${BB} write_vk --bytecode_path target/agent_minima.json -o ./target --verifier_target evm --scheme ultra_honk`,
    { cwd: CIRCUITS_DIR, stdio: "pipe" },
  );

  execSync(
    `${BB} prove --bytecode_path target/agent_minima.json --witness_path target/agent_minima.gz -o ./target --verifier_target evm --scheme ultra_honk`,
    { cwd: CIRCUITS_DIR, stdio: "pipe" },
  );

  const proofHex = fs
    .readFileSync(path.join(CIRCUITS_DIR, "target/proof"))
    .toString("hex");

  const publicInputBytes = fs.readFileSync(
    path.join(CIRCUITS_DIR, "target/public_inputs"),
  );

  const publicInputs: string[] = [];
  for (let i = 0; i < publicInputBytes.length; i += 32) {
    publicInputs.push(
      "0x" + publicInputBytes.subarray(i, i + 32).toString("hex"),
    );
  }

  const proofHash =
    "0x" +
    crypto
      .createHash("sha256")
      .update(Buffer.from(proofHex, "hex"))
      .digest("hex");

  return { proofData: "0x" + proofHex, publicInputs, proofHash };
}

function getCachedProof(
  ageThreshold: number,
  tokenThreshold: number,
): ProofOutput {
  const isOverbroad = tokenThreshold > 100;
  const label = isOverbroad ? "overbroad" : "legitimate";
  const filePath = path.join(PROOFS_DIR, `proof-${label}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `No cached proof found for ${label} scenario. Run 'npm run generate-proofs' first, or set PROVER_URL for remote proving.`,
    );
  }

  const cached = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return {
    proofData: cached.proofData,
    publicInputs: cached.publicInputs,
    proofHash: cached.proofHash,
  };
}
