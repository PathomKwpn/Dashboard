import axios from "axios";
import * as ENDPOINT from "@/config/endpoints";
import { HeaderDefaults } from "@/utils/headers";
import type { DashboardSummary } from "@/modules/Dashboard/dashboard.types";

export const getDashboardSummary = async () => {
  const res = await axios({
    url: ENDPOINT.DASHBOARD_SUMMARY_API,
    method: "GET",
    ...HeaderDefaults({ token: false }),
  });

  return res.data as DashboardSummary;
};
