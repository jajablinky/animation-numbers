import { forwardRef } from 'react';
import { motion, MotionValue } from 'framer-motion';

interface NumberDisplayProps {
  display: MotionValue<string>;
  scale: MotionValue<number>;
  transformOrigin: MotionValue<string>;
  dotPosition: MotionValue<string>;
  showDot: boolean;
}

export const NumberDisplay = forwardRef<HTMLSpanElement, NumberDisplayProps>(
  ({ display, scale, transformOrigin, dotPosition, showDot }, ref) => {
    return (
      <span className="relative inline-block">
        <motion.span
          ref={ref}
          style={{
            scale,
            display: 'inline-block',
            transformOrigin,
          }}
        >
          {display.get()}
        </motion.span>
        {showDot && (
          <motion.div
            className="absolute top-1/2 w-3 h-3 bg-red-500 rounded-full pointer-events-none z-10 -translate-y-1/2"
            style={{
              left: dotPosition,
            }}
          />
        )}
      </span>
    );
  }
);

NumberDisplay.displayName = 'NumberDisplay';
