export interface ThemeDataPoint {
  tagName: string;
  month: string;
  count: number;
}

export interface ThemeData {
  matrix: ThemeDataPoint[];
  tags: string[];
  months: string[];
  maxCount: number;
}
