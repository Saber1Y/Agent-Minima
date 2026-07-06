import express from "express";
import cors from "cors";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

const CIRCUITS_DIR = path.join(__dirname, "..", "circuits");
const NARGO = process.env.NARGO_PATH || "nargo";
const BB = process.env.BB_PATH || "bb";

interface ProveRequest {
  ageThreshold: number;
  tokenThreshold: number;
}

interface ProofOutput {
  proofData: string;
  publicInputs: string[];
  proofHash: string;
}

function generateProof({ ageThreshold, tokenThreshold }: ProveRequest): ProofOutput {
  const userAge = process.env.USER_AGE || "25";
  const userTokenBalance = process.env.USER_TOKEN_BALANCE || "500";
  const userAddress = process.env.USER_ADDRESS || "42";

  const proverToml = [
    `age_threshold = "${ageThreshold}"`,
    `token_threshold = "${tokenThreshold}"`,
    `user_address = "${userAddress}"`,
    `age = "${userAge}"`,
    `token_balance = "${userTokenBalance}"`,
  ].join("\n");

  fs.writeFileSync(path.join(CIRCUITS_DIR, "Prover.toml"), proverToml);

  execSync(`${NARGO} execute`, { cwd: CIRCUITS_DIR, stdio: "pipe" });

  execSync(
    `${BB} write_vk --bytecode_path target/agent_minima.json -o ./target --verifier_target evm --scheme ultra_honk`,
    { cwd: CIRCUITS_DIR, stdio: "pipe" }
  );

  execSync(
    `${BB} prove --bytecode_path target/agent_minima.json --witness_path target/agent_minima.gz -o ./target --verifier_target evm --scheme ultra_honk`,
    { cwd: CIRCUITS_DIR, stdio: "pipe" }
  );

  const proofHex = fs
    .readFileSync(path.join(CIRCUITS_DIR, "target/proof"))
    .toString("hex");

  const publicInputBytes = fs.readFileSync(
    path.join(CIRCUITS_DIR, "target/public_inputs")
  );

  const publicInputs: string[] = [];
  for (let i = 0; i < publicInputBytes.length; i += 32) {
    publicInputs.push("0x" + publicInputBytes.subarray(i, i + 32).toString("hex"));
  }

  const proofHash =
    "0x" +
    crypto
      .createHash("sha256")
      .update(Buffer.from(proofHex, "hex"))
      .digest("hex");

  return { proofData: "0x" + proofHex, publicInputs, proofHash };
}

app.post("/prove", (req, res) => {
  try {
    const { ageThreshold, tokenThreshold } = req.body as ProveRequest;

    if (typeof ageThreshold !== "number" || typeof tokenThreshold !== "number") {
      res.status(400).json({ error: "ageThreshold and tokenThreshold are required numbers" });
      return;
    }

    const result = generateProof({ ageThreshold, tokenThreshold });
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    res.status(500).json({ error: message });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", nargo: !!process.env.NARGO_PATH || "PATH", bb: !!process.env.BB_PATH || "PATH" });
});

const PORT = parseInt(process.env.PORT || "3002", 10);
app.listen(PORT, () => {
  console.log(`Minima Prover running on port ${PORT}`);
  console.log(`Circuits dir: ${CIRCUITS_DIR}`);
});
