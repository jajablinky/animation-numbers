import { RefObject } from 'react';
import { MotionValue } from 'framer-motion';
import { NumberDisplay } from './NumberDisplay';

interface NumberContainerProps {
  displays: MotionValue<string>[];
  scales: MotionValue<number>[];
  transformOrigins: MotionValue<string>[];
  dotLeftPositions: MotionValue<string>[];
  refs: RefObject<HTMLSpanElement>[];
  showDots: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  containerRef: RefObject<HTMLDivElement>;
}

export function NumberContainer({
  displays,
  scales,
  transformOrigins,
  dotLeftPositions,
  refs,
  showDots,
  onMouseEnter,
  onMouseLeave,
  containerRef,
}: NumberContainerProps) {
  return (
    <div
      ref={containerRef}
      className="text-center py-12 border-2 border-red-500"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h1 className="flex gap-12 text-[164px] font-roboto-mono">
        {displays.map((display, index) => (
          <NumberDisplay
            key={index}
            display={display}
            scale={scales[index]}
            transformOrigin={transformOrigins[index]}
            dotPosition={dotLeftPositions[index]}
            showDot={showDots}
            ref={refs[index] as any}
          />
        ))}
      </h1>
    </div>
  );
}
