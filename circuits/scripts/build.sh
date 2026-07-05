#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Compiling Noir circuit ==="
nargo compile

echo "=== Writing verification key ==="
bb write_vk --bytecode_path target/agent_minima.json -o ./target -t evm

echo "=== Generating Solidity verifier (UltraHonk) ==="
bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol -t evm

echo "=== Copying to contracts ==="
cp target/Verifier.sol ../contracts/src/UltraHonkVerifier.sol

echo "=== Done ==="
