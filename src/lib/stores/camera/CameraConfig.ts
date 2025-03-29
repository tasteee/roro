import { percentageToDegrees } from '$lib/helpers/numbers';

class PerspectiveCameraConfiguration {
  camera = null;
  controls = null;
  verticalDragToForward = true;
  fov = 50; // Increased FOV for better perspective
  aspect = globalThis.innerWidth / globalThis.innerHeight;
  near = 0.01;
  far = 1000;
  zoom = 1.5;
  minZoom = 0.1;
  maxZoom = 77;
  polarAngle = 1.0223005175331172;
  minPolarAngle = percentageToDegrees(45.264);
  maxPolarAngle = percentageToDegrees(88.264);
  minDistance = 0.1;
  maxDistance = 55;
  dollySpeed = 1;
  truckSpeed = 3;
  smoothTime = 0.1;
  azimuthRotateSpeed = 1;
  polarRotateSpeed = 1;
  dollyToCursor = true;
  dollyDragInverted = false;
  restThreshold = 0.0025;
  frustumSize = 10;

  // Adjust initial position for better view
  position = [2, 2, 2];
  target = { x: 0, y: 0, z: 0 };
}

export default new PerspectiveCameraConfiguration();
