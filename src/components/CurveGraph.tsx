import { useRef, useState, useEffect } from 'react';

interface CurveGraphProps {
  exponent: number;
  onExponentChange: (value: number) => void;
}

export function CurveGraph({ exponent, onExponentChange }: CurveGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const width = 200;
  const height = 150;
  const padding = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background (light)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#111827'; // gray-900
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    // Y axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#e5e7eb'; // gray-200
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i / 4) * (width - 2 * padding);
      const y = padding + (i / 4) * (height - 2 * padding);
      // Vertical grid lines
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      // Horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw curve: y = x^exponent
    ctx.strokeStyle = '#06b6d4'; // cyan-500
    ctx.lineWidth = 2.25;
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

    // Draw axis labels
    ctx.fillStyle = '#6b7280'; // gray-500
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0', padding, height - padding + 15);
    ctx.fillText('1', width - padding, height - padding + 15);
    ctx.textAlign = 'right';
    ctx.fillText('1', padding - 5, padding + 5);
    ctx.fillText('0', padding - 5, height - padding + 5);

    // Draw exponent label
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.textAlign = 'left';
    ctx.font = '11px monospace';
    ctx.fillText(`y = x^${exponent.toFixed(2)}`, padding + 5, padding + 15);
  }, [exponent]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && e.buttons !== 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Check if click is within graph area
    if (
      x >= padding &&
      x <= width - padding &&
      y >= padding &&
      y <= height - padding
    ) {
      const normalizedX = (x - padding) / graphWidth;
      const normalizedY = 1 - (y - padding) / graphHeight;

      // Calculate exponent from point on curve
      // y = x^exponent => exponent = log(y) / log(x)
      if (normalizedX > 0 && normalizedX < 1 && normalizedY > 0) {
        const newExponent = Math.log(normalizedY) / Math.log(normalizedX);
        const clampedExponent = Math.max(0.1, Math.min(20, newExponent));
        onExponentChange(clampedExponent);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-xl cursor-crosshair bg-white shadow-sm"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="text-[11px] text-gray-500 font-roboto-mono">
        Drag to set exponent from curve shape
      </div>
    </div>
  );
}

