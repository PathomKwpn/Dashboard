import axios from "axios";

export interface KPIMetric {
  label: string;
  value: string;
  change: number;
  description: string;
}

export interface SalesOverview {
  month: string;
  sales: number;
  revenue: number;
}

export interface DistributionData {
  name: string;
  value: number;
}

export interface SubscriberData {
  day: string;
  active: number;
  sevenDay: number;
  thirtyDay: number;
}

export interface IntegrationData {
  name: string;
  type: string;
  volume: number;
  pkd: number;
  position: number;
  pkdtc: number;
  cpc: number;
}

export interface ChartsData {
  kpiMetrics: KPIMetric[];
  salesOverview: SalesOverview[];
  distributionData: DistributionData[];
  subscriberData: SubscriberData[];
  integrationData: IntegrationData[];
}

export const getChartsData = async (): Promise<ChartsData> => {
  const res = await axios.get("/mock/charts.json");
  return res.data;
};
