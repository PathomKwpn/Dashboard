import axios from "axios";
import type {
  GeoSummary,
  AttackOrigin,
  SuspiciousIP,
  AttackByCountry,
  DetectionEvent,
} from "@/pages/GeoDetection/geoDetection.types";

export const getGeoSummary         = async () => (await axios.get("/mock/geo_summary.json")).data         as GeoSummary;
export const getAttackOrigins       = async () => (await axios.get("/mock/geo_attack_origins.json")).data  as AttackOrigin[];
export const getSuspiciousIPs       = async () => (await axios.get("/mock/geo_suspicious_ips.json")).data  as SuspiciousIP[];
export const getAttacksByCountry    = async () => (await axios.get("/mock/geo_attacks_by_country.json")).data as AttackByCountry[];
export const getDetectionEvents     = async () => (await axios.get("/mock/geo_detection_events.json")).data as DetectionEvent[];
