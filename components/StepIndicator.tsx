/**
 * components/StepIndicator.tsx
 *
 * Stripe-style step progress indicator
 * Shows current step in activation flow
 */

"use client";

import { motion } from "framer-motion";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: Props) {
  return (
    <div className="mb-8">
      {/* Step counter */}
      <p className="text-sm text-gray-500 mb-3">
        Step {currentStep} of {totalSteps}
      </p>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
