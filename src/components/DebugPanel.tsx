import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurveGraph } from './CurveGraph';

interface DebugPanelProps {
  onClose?: () => void;
  // Scale controls
  minScale: number;
  maxScale: number;
  curveExponent: number;
  onMinScaleChange: (value: number) => void;
  onMaxScaleChange: (value: number) => void;
  onCurveExponentChange: (value: number) => void;
  // Display controls
  displayCurveExponent: number;
  onDisplayCurveExponentChange: (value: number) => void;
  // Transform origin controls
  squishExponent: number;
  originStrength: number;
  showDots: boolean;
  showBorder: boolean;
  onSquishExponentChange: (value: number) => void;
  onOriginStrengthChange: (value: number) => void;
  onShowDotsChange: (checked: boolean) => void;
  onShowBorderChange: (checked: boolean) => void;
  // Current values
  currentScale?: number;
  currentScaleValue?: number;
  currentDisplayValue?: number;
  isInside?: number;
}

export function DebugPanel({
  onClose,
  minScale,
  maxScale,
  curveExponent,
  onMinScaleChange,
  onMaxScaleChange,
  onCurveExponentChange,
  displayCurveExponent,
  onDisplayCurveExponentChange,
  squishExponent,
  originStrength,
  showDots,
  showBorder,
  onSquishExponentChange,
  onOriginStrengthChange,
  onShowDotsChange,
  onShowBorderChange,
  currentScale,
  currentScaleValue,
  currentDisplayValue,
  isInside,
}: DebugPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('scale');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="text-gray-900 font-dm-sans h-full flex flex-col">
      {/* Header like "Setup guide" */}
      <div className="flex-none mb-6 pt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Animation Setup</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close controls"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Live Readout - Always Visible */}
      <div className="flex-none mb-4">
        <CurrentValuesContent
          scale={currentScale}
          scaleValue={currentScaleValue}
          displayValue={currentDisplayValue}
          isInside={isInside}
        />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1 -mr-1 custom-scrollbar-light">
        <CollapsibleSection
          title="Scale Configuration"
          isOpen={expandedSection === 'scale'}
          onToggle={() => toggleSection('scale')}
        >
          <ScaleCurveContent
            minScale={minScale}
            maxScale={maxScale}
            curveExponent={curveExponent}
            onMinScaleChange={onMinScaleChange}
            onMaxScaleChange={onMaxScaleChange}
            onCurveExponentChange={onCurveExponentChange}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Display Curve"
          isOpen={expandedSection === 'display'}
          onToggle={() => toggleSection('display')}
        >
           <DisplayCurveContent
            displayCurveExponent={displayCurveExponent}
            onDisplayCurveExponentChange={onDisplayCurveExponentChange}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Transform Origin"
          isOpen={expandedSection === 'origin'}
          onToggle={() => toggleSection('origin')}
        >
           <TransformOriginContent
            squishExponent={squishExponent}
            originStrength={originStrength}
            showDots={showDots}
            showBorder={showBorder}
            onSquishExponentChange={onSquishExponentChange}
            onOriginStrengthChange={onOriginStrengthChange}
            onShowDotsChange={onShowDotsChange}
            onShowBorderChange={onShowBorderChange}
          />
        </CollapsibleSection>

      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isOpen
          ? 'bg-gray-50 border-gray-200 shadow-sm'
          : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left outline-none"
      >
        <div className="flex items-center gap-3">
            {/* Circle status indicator */}
            {isOpen ? (
                 <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-400 animate-spin-slow" />
            ) : (
                <div className="w-5 h-5 rounded-full border border-gray-200 bg-white" />
            )}
            <span className={`text-sm font-medium ${isOpen ? 'text-gray-900' : 'text-gray-600'}`}>
                {title}
            </span>
        </div>
        <span className="text-gray-400">
             {isOpen ? (
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
             ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 pl-12">
               {/* Indent content to align with text */}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Content Components

function ScaleCurveContent({
  minScale,
  maxScale,
  curveExponent,
  onMinScaleChange,
  onMaxScaleChange,
  onCurveExponentChange,
}: {
  minScale: number;
  maxScale: number;
  curveExponent: number;
  onMinScaleChange: (value: number) => void;
  onMaxScaleChange: (value: number) => void;
  onCurveExponentChange: (value: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SliderInput
          label="Min Scale"
          value={minScale}
          displayValue={minScale.toFixed(2)}
          min={0.01}
          max={0.2}
          step={0.01}
          onChange={onMinScaleChange}
        />
        <SliderInput
          label="Max Scale"
          value={maxScale}
          displayValue={maxScale.toFixed(2)}
          min={1}
          max={1.5}
          step={0.01}
          onChange={onMaxScaleChange}
        />
      </div>
      
      <div className="pt-2 border-t border-gray-200">
          <SliderInput
            label="Curve Exponent"
            value={curveExponent}
            displayValue={curveExponent.toFixed(2)}
            min={3.0}
            max={4.0}
            step={0.01}
            onChange={onCurveExponentChange}
          />
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
              <span>Ease-out</span>
              <MiniCurveGraph exponent={3.0} />
            </div>
            <div className="flex-1" />
            <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
              <span>Ease-in</span>
              <MiniCurveGraph exponent={4.0} />
            </div>
          </div>
      </div>
    </div>
  );
}

function DisplayCurveContent({
  displayCurveExponent,
  onDisplayCurveExponentChange,
}: {
  displayCurveExponent: number;
  onDisplayCurveExponentChange: (value: number) => void;
}) {
  const getAggressivenessLabel = (value: number) => {
    // Higher values = more aggressive (labels were reversed before)
    if (value >= 2.8) return 'Extremely Aggressive';
    if (value >= 2.5) return 'Very Aggressive';
    if (value >= 2.2) return 'Aggressive';
    if (value >= 2.1) return 'Moderately Aggressive';
    if (value >= 2.05) return 'Moderate';
    if (value >= 2.01) return 'Gentle';
    return 'Very Gentle';
  };

  return (
    <div className="space-y-4">
      <SliderInput
        label="Drop-off"
        value={displayCurveExponent}
        displayValue={displayCurveExponent.toFixed(2)}
        min={2.0}
        max={3.0}
        step={0.01}
        onChange={onDisplayCurveExponentChange}
      />
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-2">
        <span className="text-xs text-gray-600 font-medium">
          {getAggressivenessLabel(displayCurveExponent)}
        </span>
        <span className="text-[10px] text-gray-400 font-roboto-mono">
          2.00–3.00
        </span>
      </div>
    </div>
  );
}

function TransformOriginContent({
  squishExponent,
  originStrength,
  showDots,
  showBorder,
  onSquishExponentChange,
  onOriginStrengthChange,
  onShowDotsChange,
  onShowBorderChange,
}: {
  squishExponent: number;
  originStrength: number;
  showDots: boolean;
  showBorder: boolean;
  onSquishExponentChange: (value: number) => void;
  onOriginStrengthChange: (value: number) => void;
  onShowDotsChange: (checked: boolean) => void;
  onShowBorderChange: (checked: boolean) => void;
}) {
  return (
    <div className="space-y-5">
        <SliderInput
          label="Squish"
          value={squishExponent}
          displayValue={squishExponent.toFixed(2)}
          min={0.8}
          max={1.2}
          step={0.01}
          onChange={onSquishExponentChange}
        />
        
        <SliderInput
          label="Origin Strength"
          value={originStrength}
          displayValue={originStrength.toFixed(2)}
          min={0.5}
          max={3.0}
          step={0.01}
          onChange={onOriginStrengthChange}
        />

        <div className="rounded-lg border border-gray-200 bg-white p-2 overflow-hidden">
          <CurveGraph
            exponent={squishExponent}
            onExponentChange={onSquishExponentChange}
          />
        </div>
        
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-colors cursor-pointer">
           <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showDots ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}>
               {showDots && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
           </div>
           <input
            type="checkbox"
            checked={showDots}
            onChange={e => onShowDotsChange(e.target.checked)}
            className="hidden"
           />
           <span className="text-sm text-gray-700 font-medium">Show Origin Dots</span>
        </label>
        
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-colors cursor-pointer">
           <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showBorder ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}>
               {showBorder && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
           </div>
           <input
            type="checkbox"
            checked={showBorder}
            onChange={e => onShowBorderChange(e.target.checked)}
            className="hidden"
           />
           <span className="text-sm text-gray-700 font-medium">Show Container Border</span>
        </label>
    </div>
  );
}

function CurrentValuesContent({
  scale,
  scaleValue,
  displayValue,
  isInside,
}: {
  scale?: number;
  scaleValue?: number;
  displayValue?: number;
  isInside?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <ValueCard label="Scale" value={scale} />
      <ValueCard label="Scale Val" value={scaleValue} />
      <ValueCard label="Display" value={displayValue} />
      <ValueCard label="Inside" value={isInside} />
    </div>
  );
}

function ValueCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-lg p-2.5 bg-white border border-gray-100 shadow-sm">
      <div className="text-[10px] text-gray-500 mb-0.5 font-medium uppercase tracking-wider">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900 font-roboto-mono">
        {value?.toFixed(2) || 'N/A'}
      </div>
    </div>
  );
}

function MiniCurveGraph({ exponent }: { exponent: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 40;
  const height = 20;
  const padding = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw curve: y = x^exponent
    ctx.strokeStyle = '#6b7280'; // gray-500
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    for (let i = 0; i <= graphWidth; i++) {
      const x = i / graphWidth; // 0 to 1
      const y = Math.pow(x, exponent); // 0 to 1
      const px = padding + i;
      const py = height - padding - y * graphHeight;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }, [exponent]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded bg-white"
    />
  );
}

function SliderInput({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-700">
          {label}
        </label>
        <span className="text-xs font-medium text-gray-900 bg-white px-1.5 py-0.5 rounded border border-gray-200 font-roboto-mono">
          {displayValue}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer slider-thumb-simple focus:outline-none"
          style={{
            background: `linear-gradient(to right, rgb(17, 24, 39) 0%, rgb(17, 24, 39) ${percentage}%, rgb(229, 231, 235) ${percentage}%, rgb(229, 231, 235) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
