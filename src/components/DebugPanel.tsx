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
  onSquishExponentChange: (value: number) => void;
  onOriginStrengthChange: (value: number) => void;
  onShowDotsChange: (checked: boolean) => void;
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
  onSquishExponentChange,
  onOriginStrengthChange,
  onShowDotsChange,
  currentScale,
  currentScaleValue,
  currentDisplayValue,
  isInside,
}: DebugPanelProps) {
  return (
    <div className="text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500" />
          <h3 className="text-sm font-semibold tracking-wide">Controls</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-roboto-mono text-gray-500">live</div>
          {onClose && (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition"
              aria-label="Close controls"
              title="Close"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <ScaleCurveSection
          minScale={minScale}
          maxScale={maxScale}
          curveExponent={curveExponent}
          onMinScaleChange={onMinScaleChange}
          onMaxScaleChange={onMaxScaleChange}
          onCurveExponentChange={onCurveExponentChange}
        />

        <DisplayCurveSection
          displayCurveExponent={displayCurveExponent}
          onDisplayCurveExponentChange={onDisplayCurveExponentChange}
        />

        <TransformOriginSection
          squishExponent={squishExponent}
          originStrength={originStrength}
          showDots={showDots}
          onSquishExponentChange={onSquishExponentChange}
          onOriginStrengthChange={onOriginStrengthChange}
          onShowDotsChange={onShowDotsChange}
        />

        <CurrentValuesSection
          scale={currentScale}
          scaleValue={currentScaleValue}
          displayValue={currentDisplayValue}
          isInside={isInside}
        />
      </div>
    </div>
  );
}

function ScaleCurveSection({
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
    <Section title="Scale">
      <div className="space-y-4">
        <SliderInput
          label={`Min Scale: ${minScale.toFixed(2)}`}
          value={minScale}
          min={0.01}
          max={1}
          step={0.01}
          onChange={onMinScaleChange}
        />
        <SliderInput
          label={`Max Scale: ${maxScale.toFixed(2)}`}
          value={maxScale}
          min={1}
          max={5}
          step={0.1}
          onChange={onMaxScaleChange}
        />
        <div>
          <SliderInput
            label={`Curve Exponent: ${curveExponent.toFixed(2)}`}
            value={curveExponent}
            min={0.1}
            max={3}
            step={0.1}
            onChange={onCurveExponentChange}
          />
          <div className="text-[11px] text-gray-600 mt-2 font-roboto-mono">
            {curveExponent < 1
              ? 'Ease-out'
              : curveExponent > 1
              ? 'Ease-in'
              : 'Linear'}
          </div>
        </div>
      </div>
    </Section>
  );
}

function DisplayCurveSection({
  displayCurveExponent,
  onDisplayCurveExponentChange,
}: {
  displayCurveExponent: number;
  onDisplayCurveExponentChange: (value: number) => void;
}) {
  const getAggressivenessLabel = (value: number) => {
    if (value < 0.01) return 'Extremely Aggressive';
    if (value < 0.05) return 'Very Aggressive';
    if (value < 0.1) return 'Aggressive';
    if (value < 0.5) return 'Moderately Aggressive';
    if (value < 1) return 'Moderate';
    if (value < 1.5) return 'Gentle';
    return 'Very Gentle';
  };

  return (
    <Section title="Display">
      <div className="space-y-4">
        <div>
          <SliderInput
            label={`Display Drop-off: ${
              displayCurveExponent < 0.1
                ? displayCurveExponent.toFixed(3)
                : displayCurveExponent.toFixed(2)
            }`}
            value={displayCurveExponent}
            min={0.001}
            max={2}
            step={0.001}
            onChange={onDisplayCurveExponentChange}
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[11px] text-gray-600 font-roboto-mono">
              {getAggressivenessLabel(displayCurveExponent)}
            </div>
            <div className="text-[11px] text-gray-500 font-roboto-mono">
              0.001–2.000
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function TransformOriginSection({
  squishExponent,
  originStrength,
  showDots,
  onSquishExponentChange,
  onOriginStrengthChange,
  onShowDotsChange,
}: {
  squishExponent: number;
  originStrength: number;
  showDots: boolean;
  onSquishExponentChange: (value: number) => void;
  onOriginStrengthChange: (value: number) => void;
  onShowDotsChange: (checked: boolean) => void;
}) {
  return (
    <Section title="Transform Origin">
      <div className="space-y-4">
        <div>
          <SliderInput
            label={`Squish Exponent: ${squishExponent.toFixed(2)}`}
            value={squishExponent}
            min={0.1}
            max={20}
            step={0.1}
            onChange={onSquishExponentChange}
          />
          <div className="text-[11px] text-gray-600 mt-2 font-roboto-mono">
            Higher = more aggressive squishing/bunching
          </div>
        </div>
        <div>
          <SliderInput
            label={`Origin Movement Strength: ${originStrength.toFixed(2)}`}
            value={originStrength}
            min={0}
            max={10}
            step={0.1}
            onChange={onOriginStrengthChange}
          />
          <div className="text-[11px] text-gray-600 mt-2 font-roboto-mono">
            Controls how much the transform origin moves
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <CurveGraph
            exponent={squishExponent}
            onExponentChange={onSquishExponentChange}
          />
        </div>
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showDots"
            checked={showDots}
            onChange={e => onShowDotsChange(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 bg-white text-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white cursor-pointer transition-all"
          />
          <label
            htmlFor="showDots"
            className="text-sm text-gray-800 cursor-pointer font-medium"
          >
            Show Transform Origin Dots
          </label>
          </div>
          <div className="text-[11px] text-gray-500 font-roboto-mono">
            debug
          </div>
        </div>
      </div>
    </Section>
  );
}

function CurrentValuesSection({
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
    <Section title="Readout">
      <div className="grid grid-cols-2 gap-3">
        <ValueCard label="Scale" value={scale} />
        <ValueCard label="Scale Value" value={scaleValue} />
        <ValueCard label="Display Value" value={displayValue} />
        <ValueCard label="Inside" value={isInside} />
      </div>
    </Section>
  );
}

function ValueCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-xl p-3 border border-gray-200 bg-white">
      <div className="text-[11px] text-gray-500 mb-1 tracking-wide uppercase">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900 font-roboto-mono">
        {value?.toFixed(2) || 'N/A'}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[12px] font-semibold tracking-[0.2em] uppercase text-gray-700">
          {title}
        </h4>
        <div className="h-px flex-1 mx-3 bg-gray-200" />
        <div className="text-[11px] text-gray-500 font-roboto-mono">cfg</div>
      </div>
      {children}
    </div>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-semibold text-gray-700 tracking-wide uppercase">
          {label}
        </label>
        <span className="text-[11px] font-semibold text-gray-900 font-roboto-mono bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
          {value.toFixed(step < 1 ? 3 : 2).replace(/\.?0+$/, '')}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer slider-thumb-light"
          style={{
            background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${percentage}%, rgb(229, 231, 235) ${percentage}%, rgb(229, 231, 235) 100%)`,
          }}
        />
      </div>
    </div>
  );
}

