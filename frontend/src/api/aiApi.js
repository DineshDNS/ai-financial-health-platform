import api from "./axios";

export const getRiskPrediction = () => api.get("/ai/risk");
export const getCreditPrediction = () => api.get("/ai/credit");
export const getAnomalyDetection = () => api.get("/ai/anomaly");
export const getForecast = () => api.get("/ai/forecast");

export const explainRisk = () => api.get("/ai/explain/risk");
export const explainCredit = () => api.get("/ai/explain/credit");
export const explainForecast = () => api.get("/ai/explain/forecast");
export const getRecommendations = () => api.get("/ai/explain/recommendations");
