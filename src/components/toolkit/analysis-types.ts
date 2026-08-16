export interface AnalysisFactor {
  label: string;
  score: number;
  note: string;
}

export interface AnalysisFlowNode {
  id: string;
  label: string;
  role: "sender" | "contract" | "receiver";
  risk: "low" | "medium" | "high";
}

export type AnalysisVerdict = "benign" | "suspicious" | "high-risk";

export interface TransactionAnalysis {
  summary: string;
  riskScore: number;
  verdict: AnalysisVerdict;
  factors: AnalysisFactor[];
  flow: AnalysisFlowNode[];
}
