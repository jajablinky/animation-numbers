import { useRef, useMemo } from 'react';
import {
  useSpring,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
} from 'framer-motion';

const NUMBER_COUNT = 10;

interface UseProximityAnimationProps {
  minScale: number;
  maxScale: number;
  curveExponent: number;
  displayCurveExponent: number;
  squishExponent: number;
  originStrength: number;
}

export function useProximityAnimation({
  minScale,
  maxScale,
  curveExponent,
  displayCurveExponent,
  squishExponent,
  originStrength,
}: UseProximityAnimationProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isInsideBox = useSpring(0, { damping: 50, stiffness: 500 });
  const values = Array.from({ length: NUMBER_COUNT }, () =>
    useSpring(0, { damping: 50, stiffness: 500 })
  );
  const displayValues = Array.from({ length: NUMBER_COUNT }, () =>
    useSpring(0, { damping: 50, stiffness: 500 })
  );
  const horizontalOffsets = Array.from({ length: NUMBER_COUNT }, () =>
    useSpring(0, { damping: 50, stiffness: 500 })
  );

  const displays = displayValues.map(value =>
    useTransform(value, v => `${Math.round(v)}`)
  );

  const scales = useMemo(
    () =>
      values.map(value =>
        useTransform([value, isInsideBox], (latest: number[]) => {
          const v = latest[0];
          const inside = latest[1];
          const normalized = v / 9;
          const curved = Math.pow(normalized, curveExponent);
          const insideScale = minScale + curved * (maxScale - minScale);
          return insideScale * inside + 1.0 * (1 - inside);
        })
      ),
    [values, isInsideBox, minScale, maxScale, curveExponent]
  );

  const transformOrigins = useMemo(
    () =>
      horizontalOffsets.map(offset =>
        useTransform([offset, isInsideBox], (latest: number[]) => {
          const offsetValue = latest[0];
          const inside = latest[1];

          if (inside === 0) {
            return 'center center';
          }

          const maxExtension = 100;
          const originPercent = 50 + offsetValue * (50 + maxExtension);
          return `${originPercent}% center`;
        })
      ),
    [horizontalOffsets, isInsideBox]
  );

  const dotLeftPositions = useMemo(
    () =>
      transformOrigins.map(origin =>
        useTransform(origin, (value: string) => {
          if (value === 'center center') {
            return '50%';
          }
          const match = value.match(/(-?\d+(?:\.\d+)?)%/);
          return match ? `${match[1]}%` : '50%';
        })
      ),
    [transformOrigins]
  );

  const refs = Array.from({ length: NUMBER_COUNT }, () =>
    useRef<HTMLSpanElement>(null)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  displays.forEach((display, index) => {
    useMotionValueEvent(display, 'change', latest => {
      if (refs[index].current) {
        refs[index].current!.textContent = latest;
      }
    });
  });

  const updateProximityValues = () => {
    const cursorX = x.get();
    const cursorY = y.get();

    const container = containerRef.current;
    if (!container) {
      isInsideBox.set(0);
      values.forEach(value => value.set(0));
      displayValues.forEach(value => value.set(0));
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const isInside =
      cursorX >= containerRect.left &&
      cursorX <= containerRect.right &&
      cursorY >= containerRect.top &&
      cursorY <= containerRect.bottom;

    if (!isInside) {
      if (isInsideBox.get() !== 0) {
        isInsideBox.set(0);
        values.forEach(value => value.set(0));
        displayValues.forEach(value => value.set(0));
        horizontalOffsets.forEach(offset => offset.set(0));
      }
      return;
    }

    if (isInsideBox.get() !== 1) {
      isInsideBox.set(1);
    }

    const elementData = values.map((value, index) => {
      const element = refs[index].current;
      if (!element) {
        return { index, normalizedDistance: 1, eased: 0, displayEased: 0 };
      }

      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const cursorPosInContainer =
        (cursorX - containerRect.left) / containerRect.width;
      const elementPosInContainer =
        (elementCenterX - containerRect.left) / containerRect.width;

      const isFirstDigit = index === 0;
      const isLastDigit = index === NUMBER_COUNT - 1;
      const maxExtension = 100;

      let transformOriginPercent: number;

      if (isFirstDigit) {
        transformOriginPercent = 0;
      } else if (isLastDigit) {
        transformOriginPercent = 100;
      } else {
        const distanceFromCursorSide = Math.abs(
          elementPosInContainer - cursorPosInContainer
        );
        const isElementRightOfCursor =
          elementPosInContainer > cursorPosInContainer;
        const curvedDistance = Math.pow(distanceFromCursorSide, squishExponent);
        const baseMovement = curvedDistance * (50 + maxExtension);
        transformOriginPercent = isElementRightOfCursor
          ? 50 - baseMovement * originStrength
          : 50 + baseMovement * originStrength;
      }

      const normalizedOffset =
        (transformOriginPercent - 50) / (50 + maxExtension);
      horizontalOffsets[index].set(normalizedOffset);

      const distance = Math.hypot(
        cursorX - elementCenterX,
        cursorY - elementCenterY
      );

      const containerDiagonal = Math.hypot(
        containerRect.width,
        containerRect.height
      );
      const maxDistance = containerDiagonal;
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      const eased = 1 - Math.pow(normalizedDistance, 0.9);
      const proximityValue = Math.max(0, Math.min(9, 9 * eased));
      value.set(proximityValue);

      const displayEased =
        1 - Math.pow(normalizedDistance, displayCurveExponent);

      return { index, normalizedDistance, eased, displayEased };
    });

    const displayEasedValues = elementData.map(d => d.displayEased);
    const minDisplayEased = Math.min(...displayEasedValues);
    const maxDisplayEased = Math.max(...displayEasedValues);
    const displayRange = maxDisplayEased - minDisplayEased;

    elementData.forEach(({ index, displayEased }) => {
      let displayProximityValue: number;
      if (displayRange === 0) {
        displayProximityValue = displayEased >= 0.5 ? 9 : 0;
      } else {
        displayProximityValue =
          ((displayEased - minDisplayEased) / displayRange) * 9;
      }
      displayProximityValue = Math.max(0, Math.min(9, displayProximityValue));
      displayValues[index].set(displayProximityValue);
    });
  };

  const handleMouseEnter = () => {
    isInsideBox.set(1);
  };

  const handleMouseLeave = () => {
    isInsideBox.set(0);
    values.forEach(value => value.set(0));
    displayValues.forEach(value => value.set(0));
    horizontalOffsets.forEach(offset => offset.set(0));
  };

  useMotionValueEvent(x, 'change', updateProximityValues);
  useMotionValueEvent(y, 'change', updateProximityValues);

  return {
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
    currentValues: {
      scale: scales[0],
      scaleValue: values[0],
      displayValue: displayValues[0],
      isInside: isInsideBox,
    },
  };
}

