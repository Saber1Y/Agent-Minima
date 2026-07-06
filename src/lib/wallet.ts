import { ethers } from "ethers";

const RPC_URL = process.env.RPC_BASE_SEPOLIA || "https://sepolia.base.org";
const AGENT_KEY = process.env.AGENT_PRIVATE_KEY || "";

const AGENT_ACCOUNT_ABI = [
  "function executeWithProof((bytes,bytes32[]),address,bytes) returns (bytes)",
  "function addSessionKey(address,address[])",
  "function removeSessionKey(address)",
  "function sessionKeys(address) view returns (bool)",
  "function nonce() view returns (uint256)",
];

export interface ExecuteResult {
  txHash: string;
  explorerUrl: string;
  functionCalled: string;
}

export async function executeWithProof(
  accountAddress: string,
  proofData: string,
  publicInputs: string[],
  target: string,
  data: string
): Promise<ExecuteResult> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(AGENT_KEY, provider);

  const account = new ethers.Contract(accountAddress, AGENT_ACCOUNT_ABI, signer);

  const tx = await account.executeWithProof(
    [proofData, publicInputs],
    target,
    data
  );

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    explorerUrl: `https://sepolia.basescan.org/tx/${receipt.hash}`,
    functionCalled: "executeWithProof",
  };
}

export async function getBalanceOf(contractAddress: string, userAddress: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const abi = ["function balanceOf(address) view returns (uint256)"];
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const balance = await contract.balanceOf(userAddress);
  return ethers.formatUnits(balance, 18);
}
