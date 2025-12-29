import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DebugPanel } from '../components/DebugPanel';
import { NumberContainer } from '../components/NumberContainer';
import { useProximityAnimation } from '../hooks/useProximityAnimation';

function HomePage() {
  const [showDebug, setShowDebug] = useState(false);
  const [minScale, setMinScale] = useState(0.2);
  const [maxScale, setMaxScale] = useState(2.0);
  const [curveExponent, setCurveExponent] = useState(1.0);
  const [displayCurveExponent, setDisplayCurveExponent] = useState(0.1);
  const [squishExponent, setSquishExponent] = useState(0.6);
  const [originStrength, setOriginStrength] = useState(1.0);
  const [showDots, setShowDots] = useState(true);

  const {
    x,
    y,
    refs,
    containerRef,
    displays,
    scales,
    transformOrigins,
    dotLeftPositions,
    handleMouseEnter,
    handleMouseLeave,
    currentValues,
  } = useProximityAnimation({
    minScale,
    maxScale,
    curveExponent,
    displayCurveExponent,
    squishExponent,
    originStrength,
  });

  return (
    <div
      className="min-h-screen w-full bg-bg-primary text-text-primary font-roboto-mono"
      onMouseMove={e => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <div className="flex min-h-screen w-full">
        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <button
              onClick={() => setShowDebug(s => !s)}
              className="px-3 py-2 bg-white/90 text-gray-900 text-sm font-medium rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-150 active:scale-[0.99] backdrop-blur"
            >
              {showDebug ? 'Hide Controls' : 'Show Controls'}
            </button>
            <div className="text-[11px] text-gray-500 font-roboto-mono">
              pointer-driven
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <NumberContainer
              displays={displays}
              scales={scales}
              transformOrigins={transformOrigins}
              dotLeftPositions={dotLeftPositions}
              refs={refs}
              showDots={showDots}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              containerRef={containerRef}
            />
          </div>
        </div>

        {/* Sidebar (in layout, animates in/out) */}
        <AnimatePresence initial={false}>
          {showDebug && (
            <motion.aside
              key="debug-sidebar"
              initial={{ width: 0, opacity: 0, x: 24 }}
              animate={{ width: 360, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 24 }}
              transition={{ type: 'spring', stiffness: 420, damping: 40 }}
              className="h-screen border-l border-gray-200 bg-white/85 backdrop-blur-md shadow-xl overflow-hidden"
            >
              <div className="h-full p-4 overflow-y-auto custom-scrollbar-light">
                <DebugPanel
                  onClose={() => setShowDebug(false)}
                  minScale={minScale}
                  maxScale={maxScale}
                  curveExponent={curveExponent}
                  onMinScaleChange={setMinScale}
                  onMaxScaleChange={setMaxScale}
                  onCurveExponentChange={setCurveExponent}
                  displayCurveExponent={displayCurveExponent}
                  onDisplayCurveExponentChange={setDisplayCurveExponent}
                  squishExponent={squishExponent}
                  originStrength={originStrength}
                  showDots={showDots}
                  onSquishExponentChange={setSquishExponent}
                  onOriginStrengthChange={setOriginStrength}
                  onShowDotsChange={setShowDots}
                  currentScale={currentValues.scale?.get()}
                  currentScaleValue={currentValues.scaleValue?.get()}
                  currentDisplayValue={currentValues.displayValue?.get()}
                  isInside={currentValues.isInside?.get()}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomePage;
