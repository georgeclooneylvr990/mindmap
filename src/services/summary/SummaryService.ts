import type { MonthlySummaryData } from "@/types/summary";

export interface SummaryService {
  generate(year: number, month: number): Promise<MonthlySummaryData>;
}
