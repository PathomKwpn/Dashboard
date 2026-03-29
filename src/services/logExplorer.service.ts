import axios from "axios";
import type { LogEntry } from "@/pages/LogExplorer/logExplorer.types";

export const getLogs = async (): Promise<LogEntry[]> => {
  const res = await axios.get("/mock/logs.json");
  return res.data as LogEntry[];
};
