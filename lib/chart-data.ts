export const runDistributions = [
  { run: "Run 3", n: 87, mean: 61.92, counts: [0, 0, 0, 0, 0, 0, 1, 2, 6, 10, 12, 17, 10, 3, 4, 5, 1, 6, 4, 6] },
  { run: "Run 4", n: 87, mean: 63.62, counts: [0, 0, 0, 0, 0, 0, 1, 3, 7, 7, 11, 13, 12, 4, 5, 5, 2, 5, 3, 9] },
  { run: "Run 5", n: 86, mean: 63.14, counts: [0, 0, 0, 0, 0, 0, 0, 0, 8, 11, 15, 11, 5, 6, 6, 5, 4, 4, 5, 6] },
  { run: "Run 6", n: 86, mean: 64.83, counts: [0, 0, 0, 0, 0, 0, 1, 2, 1, 6, 16, 17, 12, 3, 5, 2, 3, 5, 6, 7] },
] as const;

export const runMeans = [
  { run: "Run 3", n: 87, mean: 61.92, low: 58.38, high: 65.47 },
  { run: "Run 4", n: 87, mean: 63.62, low: 59.79, high: 67.45 },
  { run: "Run 5", n: 86, mean: 63.14, low: 59.48, high: 66.8 },
  { run: "Run 6", n: 86, mean: 64.83, low: 61.2, high: 68.45 },
] as const;

export const personalityFactors = [
  { id: "EX", label: "Extraversion", n: 86, corr: 0.05, min: 1.1, max: 8.1, points: [{ x: 1.62, y: 62.0, n: 5 }, { x: 3.18, y: 64.45, n: 17 }, { x: 4.56, y: 62.91, n: 23 }, { x: 5.8, y: 63.12, n: 25 }, { x: 7.17, y: 64.8, n: 16 }] },
  { id: "AX", label: "Anxiety", n: 86, corr: -0.04, min: 1.7, max: 10.2, points: [{ x: 2.68, y: 68.65, n: 13 }, { x: 4.4, y: 61.82, n: 26 }, { x: 5.98, y: 64.26, n: 18 }, { x: 7.33, y: 59.32, n: 18 }, { x: 9.26, y: 67.55, n: 11 }] },
  { id: "TM", label: "Tough-Mindedness", n: 86, corr: 0.02, min: 2.3, max: 12.0, points: [{ x: 3.52, y: 61.53, n: 21 }, { x: 5.06, y: 64.02, n: 31 }, { x: 7.09, y: 65.94, n: 20 }, { x: 8.91, y: 62.16, n: 11 }, { x: 11.2, y: 62.71, n: 3 }] },
  { id: "IN", label: "Independence", n: 86, corr: -0.13, min: 0.0, max: 8.5, points: [{ x: 0.88, y: 64.9, n: 12 }, { x: 2.64, y: 69.27, n: 12 }, { x: 4.25, y: 61.49, n: 30 }, { x: 5.76, y: 65.84, n: 20 }, { x: 7.69, y: 57.99, n: 12 }] },
  { id: "SC", label: "Self-Control", n: 86, corr: 0.08, min: 0.3, max: 9.8, points: [{ x: 1.41, y: 66.91, n: 10 }, { x: 3.28, y: 63.49, n: 37 }, { x: 4.89, y: 60.93, n: 26 }, { x: 6.7, y: 67.4, n: 12 }, { x: 9.8, y: 56.25, n: 1 }] },
] as const;

export const trainingHistory = {
  epochs: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
  trainingLoss: [0.6545, 0.575, 0.5682, 0.566, 0.5647, 0.5612, 0.5622, 0.5618, 0.5616, 0.5609, 0.5619, 0.5565, 0.5592],
  validationLoss: [0.6375, 0.6051, 0.6029, 0.6013, 0.6002, 0.6005, 0.6005, 0.6, 0.6001, 0.5998, 0.5991, 0.5993, 0.5991],
  validationBalancedAccuracy: [0.647, 0.658, 0.653, 0.654, 0.655, 0.66, 0.665, 0.663, 0.663, 0.66, 0.666, 0.665, 0.668],
  selectedEpoch: 48,
} as const;

export const participantDifferences = [28.5, 25.1, 24.9, 22.6, 22.5, 20.3, 18.4, 16.9, 15.0, 14.3, 14.0, 13.1, 12.7, 12.0, 10.7, 10.7, 9.9, 9.4, 9.3, 9.2, 9.0, 8.7, 8.7, 8.4, 7.5, 7.4, 7.1, 6.7, 6.1, 6.0, 5.7, 5.1, 5.1, 4.7, 3.7, 3.3, 2.7, 2.4, 2.4, 2.3, 1.6, 1.2, 1.2, 1.2, 1.0, 1.0, 0.5, 0.4, -0.2, -0.4, -1.1, -1.2, -1.6, -1.8, -2.4, -2.5, -2.5, -2.6, -4.9, -6.1, -7.1, -10.1, -10.7, -12.1, -12.5, -31.4] as const;

export const matchedDistributions = [
  { id: "model", label: "Held-out CSP MLP", mean: 68.73, counts: [0, 5, 7, 10, 8, 7, 6, 7, 7, 3, 4, 2] },
  { id: "behavior", label: "Behavioral BCI", mean: 63.74, counts: [2, 13, 8, 11, 7, 5, 2, 2, 8, 2, 3, 3] },
] as const;
