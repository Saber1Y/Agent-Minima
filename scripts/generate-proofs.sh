#!/usr/bin/env bash
set -euo pipefail

CIRCUITS_DIR="$(cd "$(dirname "$0")/../circuits" && pwd)"
OUT_DIR="$(cd "$(dirname "$0")/../data/proofs" && pwd)"
NARGO="${NARGO_PATH:-nargo}"
BB="${BB_PATH:-bb}"
USER_AGE="${USER_AGE:-25}"
USER_TOKEN_BALANCE="${USER_TOKEN_BALANCE:-500}"
USER_ADDRESS="${USER_ADDRESS:-42}"

mkdir -p "$OUT_DIR"

generate() {
  local label="$1" age_threshold="$2" token_threshold="$3"

  echo "=== Generating $label proof (age>=$age_threshold, token>=$token_threshold) ==="

  cat > "$CIRCUITS_DIR/Prover.toml" <<EOF
age_threshold = "$age_threshold"
token_threshold = "$token_threshold"
user_address = "$USER_ADDRESS"
age = "$USER_AGE"
token_balance = "$USER_TOKEN_BALANCE"
EOF

  $NARGO execute --silence-warnings
  $BB write_vk --bytecode_path "$CIRCUITS_DIR/target/agent_minima.json" -o "$CIRCUITS_DIR/target" --scheme ultra_honk --verifier_target evm
  $BB prove --bytecode_path "$CIRCUITS_DIR/target/agent_minima.json" --witness_path "$CIRCUITS_DIR/target/agent_minima.gz" -o "$CIRCUITS_DIR/target" --scheme ultra_honk --verifier_target evm

  # Extract hex
  PROOF_HEX=$(xxd -p "$CIRCUITS_DIR/target/proof" | tr -d '\n')
  PUBLIC_INPUTS_HEX=$(xxd -p "$CIRCUITS_DIR/target/public_inputs" | tr -d '\n')

  # Build public inputs array (32 bytes each)
  PI="["
  for ((i=0; i<${#PUBLIC_INPUTS_HEX}; i+=64)); do
    PI+="\"0x${PUBLIC_INPUTS_HEX:$i:64}\","
  done
  PI="${PI%,}]"

  PROOF_HASH=$(echo -n "$PROOF_HEX" | xxd -r -p | shasum -a 256 | head -c 64)

  cat > "$OUT_DIR/proof-$label.json" <<EOF
{
  "scenario": "$label",
  "thresholds": { "age": $age_threshold, "token": $token_threshold },
  "proofData": "0x$PROOF_HEX",
  "publicInputs": $PI,
  "proofHash": "0x$PROOF_HASH"
}
EOF

  echo "  → $OUT_DIR/proof-$label.json (proofHash: 0x$PROOF_HASH)"
}

generate "legitimate" 18 100
generate "overbroad" 18 500

# Reset to legitimate thresholds
cat > "$CIRCUITS_DIR/Prover.toml" <<EOF
age_threshold = "18"
token_threshold = "100"
user_address = "$USER_ADDRESS"
age = "$USER_AGE"
token_balance = "$USER_TOKEN_BALANCE"
EOF

echo ""
echo "Done. Both proofs saved to $OUT_DIR/"
