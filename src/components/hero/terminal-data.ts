import { formatNumber } from "@/lib/format";

const HEX_CHARS = "0123456789abcdef";

function randomHex(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += HEX_CHARS[(Math.random() * 16) | 0];
  }
  return out;
}

export function randomTxHash(): string {
  return `0x${randomHex(64)}`;
}

export function randomAddress(): string {
  return `0x${randomHex(40)}`;
}

export function truncateMiddle(value: string, head = 8, tail = 6): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function randomGas(): number {
  return Math.round(18 + Math.random() * 140);
}

export function randomValue(): string {
  const eth = Math.random() * (Math.random() < 0.1 ? 500 : 4);
  return eth.toFixed(eth < 1 ? 5 : 3);
}

function randomBlock(base: number): number {
  return base + ((Math.random() * 3) | 0);
}

export type LogSeverity = "info" | "notice" | "warn" | "critical";

export interface LogLine {
  id: number;
  severity: LogSeverity;
  text: string;
}

export const CONTRACT_LABELS = [
  "MonadSwapRouter",
  "WrappedMON",
  "LendingPoolV3",
  "PerpEngine",
  "VaultStrategy07",
  "BridgeRelayer",
  "OracleAggregator",
  "GovernanceTimelock",
  "NFTMarketV2",
  "FlashLoanReceiver",
];

export const EXPLOIT_PATTERNS = [
  "reentrancy probe",
  "price-oracle deviation",
  "flash-loan drain path",
  "access-control bypass attempt",
  "signature replay window",
  "unchecked delegatecall",
  "integer overflow surface",
];

let blockHeight = 4_812_006;
let idCounter = 0;

function nextId(): number {
  idCounter += 1;
  return idCounter;
}

type LineGenerator = () => LogLine;

const generators: LineGenerator[] = [
  () => ({
    id: nextId(),
    severity: "info",
    text: `mempool  tx ${truncateMiddle(randomTxHash())}  gas=${randomGas()}gwei  value=${randomValue()} MON`,
  }),
  () => ({
    id: nextId(),
    severity: "info",
    text: `pending  from=${truncateMiddle(randomAddress(), 6, 4)}  to=${truncateMiddle(randomAddress(), 6, 4)}  nonce=${(Math.random() * 9000) | 0}`,
  }),
  () => {
    blockHeight = randomBlock(blockHeight);
    return {
      id: nextId(),
      severity: "notice",
      text: `block    #${formatNumber(blockHeight)}  txs=${120 + ((Math.random() * 340) | 0)}  gasUsed=${(62 + Math.random() * 30).toFixed(1)}%`,
    };
  },
  () => ({
    id: nextId(),
    severity: "info",
    text: `event    ${CONTRACT_LABELS[(Math.random() * CONTRACT_LABELS.length) | 0]}::Transfer  topic=${randomHex(8)}`,
  }),
  () => ({
    id: nextId(),
    severity: "notice",
    text: `contract ${CONTRACT_LABELS[(Math.random() * CONTRACT_LABELS.length) | 0]} state diff detected  slot=0x${randomHex(4)}`,
  }),
  () => ({
    id: nextId(),
    severity: "warn",
    text: `sandbox  simulating ${EXPLOIT_PATTERNS[(Math.random() * EXPLOIT_PATTERNS.length) | 0]}  target=${truncateMiddle(randomAddress(), 6, 4)}`,
  }),
  () => ({
    id: nextId(),
    severity: Math.random() < 0.35 ? "critical" : "warn",
    text: `flagged  contract ${truncateMiddle(randomAddress(), 6, 4)}  risk=${(72 + Math.random() * 27).toFixed(0)}  heuristic=${EXPLOIT_PATTERNS[(Math.random() * EXPLOIT_PATTERNS.length) | 0]}`,
  }),
  () => ({
    id: nextId(),
    severity: "info",
    text: `gas      base=${(8 + Math.random() * 6).toFixed(2)}gwei  priority=${(0.5 + Math.random() * 3).toFixed(2)}gwei  queue=${(400 + Math.random() * 900) | 0}`,
  }),
];

const WEIGHTS = [3, 3, 2, 2, 2, 1.4, 0.8, 2];
const TOTAL_WEIGHT = WEIGHTS.reduce((a, b) => a + b, 0);

export function generateLogLine(): LogLine {
  let r = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < generators.length; i++) {
    r -= WEIGHTS[i];
    if (r <= 0) return generators[i]();
  }
  return generators[0]();
}

export function generateBootLines(): string[] {
  return [
    "PHOSPHOR OS v0.9.4 — MONAD TESTNET LINK",
    `node ${randomHex(4)}  init sequence…`,
    "mounting mempool ingestion daemon........ OK",
    "attaching contract-event listener......... OK",
    "loading exploit-sandbox runtime........... OK",
    `handshake  peer=${truncateMiddle(randomAddress(), 6, 4)}  latency=${(8 + Math.random() * 20).toFixed(1)}ms`,
    "verifying chain head....................... OK",
    "READY.",
  ];
}
