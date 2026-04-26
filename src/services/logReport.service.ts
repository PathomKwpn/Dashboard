import axios from "axios";
import type {
  Report,
  ErrorSummaryData,
  TrafficSummaryData,
  LogDistributionData,
  ExportConfig,
} from "@/pages/LogReport/logReport.types";
import {
  LOG_REPORTS_API,
  LOG_REPORTS_ERROR_SUMMARY_API,
  LOG_REPORTS_TRAFFIC_SUMMARY_API,
  LOG_REPORTS_DISTRIBUTION_API,
} from "@/config/endpoints";

export const getReports         = async () => (await axios.get(LOG_REPORTS_API)).data                 as Report[];
export const getErrorSummary    = async () => (await axios.get(LOG_REPORTS_ERROR_SUMMARY_API)).data    as ErrorSummaryData;
export const getTrafficSummary  = async () => (await axios.get(LOG_REPORTS_TRAFFIC_SUMMARY_API)).data  as TrafficSummaryData;
export const getLogDistribution = async () => (await axios.get(LOG_REPORTS_DISTRIBUTION_API)).data     as LogDistributionData;

export const triggerExport = async (_config: ExportConfig): Promise<{ job_id: string; filename: string }> => {
  await new Promise((r) => setTimeout(r, 1600));
  return { job_id: `export-${Date.now()}`, filename: `logs-export-${new Date().toISOString().slice(0, 10)}` };
};

export const downloadReportFile = async (reportId: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 400));
  void reportId;
};
