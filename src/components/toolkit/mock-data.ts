import {
  CONTRACT_LABELS,
  randomAddress,
  randomGas,
  randomTxHash,
  randomValue,
} from "@/components/hero/terminal-data";

let idCounter = 0;
function nextId(): number {
  idCounter += 1;
  return idCounter;
}

export interface MempoolTxRow {
  id: number;
  hash: string;
  from: string;
  to: string;
  valueEth: string;
  gasGwei: number;
}

export function generateMempoolRow(): MempoolTxRow {
  return {
    id: nextId(),
    hash: randomTxHash(),
    from: randomAddress(),
    to: randomAddress(),
    valueEth: randomValue(),
    gasGwei: randomGas(),
  };
}

export interface ContractEventRow {
  id: number;
  contract: string;
  event: string;
  block: number;
  txHash: string;
  flagged: boolean;
}

const EVENT_NAMES = ["Transfer", "Approval", "Swap", "Deposit", "Withdraw", "Sync", "OwnershipTransferred"];

let block = 4_812_006;

export function generateContractEventRow(): ContractEventRow {
  block += Math.random() < 0.4 ? 1 : 0;
  return {
    id: nextId(),
    contract: CONTRACT_LABELS[(Math.random() * CONTRACT_LABELS.length) | 0],
    event: EVENT_NAMES[(Math.random() * EVENT_NAMES.length) | 0],
    block,
    txHash: randomTxHash(),
    flagged: Math.random() < 0.12,
  };
}

export const SANDBOX_TARGETS = CONTRACT_LABELS.map((label) => ({
  label,
  address: randomAddress(),
}));

export const EXPLOIT_SIM_PATTERNS = [
  "Reentrancy Probe",
  "Price-Oracle Deviation",
  "Flash-Loan Drain Path",
  "Access-Control Bypass",
  "Signature Replay Window",
  "Unchecked Delegatecall",
  "Integer Overflow Surface",
] as const;

export interface SimulationStep {
  label: string;
  ok: boolean;
}

export interface SimulationResult {
  vulnerable: boolean;
  confidence: number;
  estimatedImpactEth: string;
  steps: SimulationStep[];
}

export function runMockSimulation(pattern: string): SimulationResult {
  const vulnerable = Math.random() < 0.4;
  const stepLabels = [
    "forking chain state at head-1",
    `deploying attacker contract against pattern: ${pattern.toLowerCase()}`,
    "priming initial state",
    "executing attack transaction",
    "checking invariant deltas",
    "computing extractable value",
  ];
  const steps = stepLabels.map((label, i) => ({
    label,
    ok: i < stepLabels.length - 1 || vulnerable ? true : Math.random() > 0.2,
  }));

  return {
    vulnerable,
    confidence: Math.round(vulnerable ? 70 + Math.random() * 29 : 4 + Math.random() * 30),
    estimatedImpactEth: vulnerable ? (Math.random() * 900 + 5).toFixed(2) : "0.00",
    steps,
  };
}
