import { Router } from "express";
import {
  getApiEndpoints,
  getApiEndpointById,
  getFeatures,
  getFeatureById,
  getDocStats,
  getFeatureCategories,
  getApiMethods,
  createApiEndpoint,
  createFeature,
  updateApiEndpoint,
  deleteApiEndpoint,
  updateFeature,
  deleteFeature,
  toggleEndpointStatus,
  toggleFeatureStatus,
} from "../controllers/documentation.controller";
import { both_authenticate } from "../middlewares/custom_authenticate_token";

const router = Router();

// Public routes (no authentication required)
router.get("/stats", getDocStats);
router.get("/feature-categories", getFeatureCategories);
router.get("/api-methods", getApiMethods);

// Protected routes (authentication required for both students and admins)
router.get("/endpoints", both_authenticate, getApiEndpoints);
router.get("/endpoints/:endpointId", both_authenticate, getApiEndpointById);
router.get("/features", both_authenticate, getFeatures);
router.get("/features/:featureId", both_authenticate, getFeatureById);

// Admin-only routes (admin role required)
router.post("/endpoints", both_authenticate, createApiEndpoint);
router.post("/features", both_authenticate, createFeature);

// Update routes
router.put("/endpoints/:endpointId", both_authenticate, updateApiEndpoint);
router.put("/features/:featureId", both_authenticate, updateFeature);

// Delete routes (soft delete)
router.delete("/endpoints/:endpointId", both_authenticate, deleteApiEndpoint);
router.delete("/features/:featureId", both_authenticate, deleteFeature);

// Toggle status routes
router.patch("/endpoints/:endpointId/toggle", both_authenticate, toggleEndpointStatus);
router.patch("/features/:featureId/toggle", both_authenticate, toggleFeatureStatus);

export default router;
