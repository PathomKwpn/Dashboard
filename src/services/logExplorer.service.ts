import axios from "axios";
import type { LogEntry } from "@/pages/LogExplorer/logExplorer.types";
import { LOGS_API } from "@/config/endpoints";

export const getLogs = async (): Promise<LogEntry[]> => {
  const res = await axios.get(LOGS_API);
  return res.data as LogEntry[];
};
