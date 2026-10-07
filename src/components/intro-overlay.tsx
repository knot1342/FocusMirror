import * as SplashScreen from 'expo-splash-screen';
import { useRef, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, Line, Rect } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// Must match the expo-splash-screen config in app.json so the handoff from the native splash is seamless.
const BACKGROUND_COLOR = '#000000';
const LOGO_SIZE = 200;

// Logo geometry, measured from assets/images/focus-mirror-logo.png (1024px canvas, centered).
const UNIT = LOGO_SIZE / 1024;
const HOLE_RADIUS = 18; // the center dot, which becomes the see-through hole
const MIDLINE_HALF_LENGTH = 370;
const MIDLINE_WIDTH = 2;
const MIDLINE_OPACITY = 0.17;
const BOTTOM_OPACITY = 0.16; // the faint "reflection" half
const RINGS = [
  { radius: 138.5, width: 4, topOpacity: 0.55 },
  { radius: 244.5, width: 6, topOpacity: 0.78 },
  { radius: 366.5, width: 8, topOpacity: 1 },
];

const BREATH_SCALE = 0.9;

type Size = { width: number; height: number };

/**
 * Plays the FocusMirror logo intro on launch. The center dot is a hole through which the screen
 * underneath shows; the logo zooms until the hole covers the whole screen, then the layer is removed.
 */
export function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [size, setSize] = useState<Size | null>(null);
  const started = useRef(false);
  const breath = useSharedValue(1);
  const zoom = useSharedValue(0);

  const cx = (size?.width ?? 0) / 2;
  const cy = (size?.height ?? 0) / 2;
  const halfDiagonal = Math.hypot(cx, cy);
  // Zoom on a log scale so the growth feels steady, ending when the hole reaches the screen corners.
  const zoomRange = Math.log((halfDiagonal + 2) / (HOLE_RADIUS * UNIT) / BREATH_SCALE);
  const scale = useDerivedValue(() => breath.get() * Math.exp(zoom.get() * zoomRange));

  function handleLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
    if (started.current) return;
    started.current = true;

    SplashScreen.hideAsync().finally(() => {
      breath.set(
        withDelay(150, withTiming(BREATH_SCALE, { duration: 200, easing: Easing.inOut(Easing.quad) })),
      );
      zoom.set(
        withDelay(
          350,
          withTiming(1, { duration: 800, easing: Easing.in(Easing.quad) }, (finished) => {
            'worklet';
            if (finished) {
              scheduleOnRN(setVisible, false);
            }
          }),
        ),
      );
    });
  }

  if (!visible) return null;

  return (
    <View
      onLayout={handleLayout}
      // Solid until measured (matches the native splash); after that the Svg draws the black around the hole.
      style={[styles.overlay, { backgroundColor: size ? 'transparent' : BACKGROUND_COLOR }]}>
      {size && (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <ClipPath id="top-half">
              <Rect x={0} y={0} width={size.width} height={cy} />
            </ClipPath>
            <ClipPath id="bottom-half">
              <Rect x={0} y={cy} width={size.width} height={size.height - cy} />
            </ClipPath>
          </Defs>

          <Backdrop scale={scale} cx={cx} cy={cy} thickness={halfDiagonal * 2} />

          {RINGS.map((ring) => (
            <Ring
              key={`top-${ring.radius}`}
              scale={scale}
              cx={cx}
              cy={cy}
              radius={ring.radius}
              width={ring.width}
              opacity={ring.topOpacity}
              clipPath="url(#top-half)"
            />
          ))}
          {RINGS.map((ring) => (
            <Ring
              key={`bottom-${ring.radius}`}
              scale={scale}
              cx={cx}
              cy={cy}
              radius={ring.radius}
              width={ring.width}
              opacity={BOTTOM_OPACITY}
              clipPath="url(#bottom-half)"
            />
          ))}

          <MidlineHalf scale={scale} cx={cx} cy={cy} side={-1} />
          <MidlineHalf scale={scale} cx={cx} cy={cy} side={1} />
        </Svg>
      )}
    </View>
  );
}

type ShapeProps = {
  scale: SharedValue<number>;
  cx: number;
  cy: number;
};

/** A black annulus whose inner edge is the hole; it extends far enough to cover the screen. */
function Backdrop({ scale, cx, cy, thickness }: ShapeProps & { thickness: number }) {
  const animatedProps = useAnimatedProps(() => ({
    r: HOLE_RADIUS * UNIT * scale.get() + thickness / 2,
  }));
  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      fill="none"
      stroke={BACKGROUND_COLOR}
      strokeWidth={thickness}
      animatedProps={animatedProps}
    />
  );
}

function Ring({
  scale,
  cx,
  cy,
  radius,
  width,
  opacity,
  clipPath,
}: ShapeProps & { radius: number; width: number; opacity: number; clipPath: string }) {
  const animatedProps = useAnimatedProps(() => ({
    r: radius * UNIT * scale.get(),
    strokeWidth: width * UNIT * scale.get(),
  }));
  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      fill="none"
      stroke="#ffffff"
      strokeOpacity={opacity}
      clipPath={clipPath}
      animatedProps={animatedProps}
    />
  );
}

/** One side of the horizontal line, stopping at the hole's edge. */
function MidlineHalf({ scale, cx, cy, side }: ShapeProps & { side: 1 | -1 }) {
  const animatedProps = useAnimatedProps(() => ({
    x1: cx + side * HOLE_RADIUS * UNIT * scale.get(),
    x2: cx + side * MIDLINE_HALF_LENGTH * UNIT * scale.get(),
    strokeWidth: MIDLINE_WIDTH * UNIT * scale.get(),
  }));
  return (
    <AnimatedLine
      y1={cy}
      y2={cy}
      stroke="#ffffff"
      strokeOpacity={MIDLINE_OPACITY}
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
});
