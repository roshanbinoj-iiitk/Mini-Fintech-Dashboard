export interface AIInsight {
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "tip";
  recommendation: string;
}

export interface AIInsightsResponse {
  healthScore: number;
  summary: string;
  insights: AIInsight[];
}
