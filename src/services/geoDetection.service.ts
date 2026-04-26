import axios from "axios";
import type {
  GeoSummary,
  AttackOrigin,
  SuspiciousIP,
  AttackByCountry,
  DetectionEvent,
} from "@/pages/GeoDetection/geoDetection.types";
import {
  GEO_SUMMARY_API,
  GEO_ATTACK_ORIGINS_API,
  GEO_SUSPICIOUS_IPS_API,
  GEO_ATTACKS_BY_COUNTRY_API,
  GEO_DETECTION_EVENTS_API,
} from "@/config/endpoints";

export const getGeoSummary      = async () => (await axios.get(GEO_SUMMARY_API)).data            as GeoSummary;
export const getAttackOrigins   = async () => (await axios.get(GEO_ATTACK_ORIGINS_API)).data     as AttackOrigin[];
export const getSuspiciousIPs   = async () => (await axios.get(GEO_SUSPICIOUS_IPS_API)).data     as SuspiciousIP[];
export const getAttacksByCountry= async () => (await axios.get(GEO_ATTACKS_BY_COUNTRY_API)).data as AttackByCountry[];
export const getDetectionEvents = async () => (await axios.get(GEO_DETECTION_EVENTS_API)).data   as DetectionEvent[];
