import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import type { StarData } from '@/hooks/use-star-contributions';

gsap.registerPlugin(ScrollTrigger);

const TWINKLE_SPEED = 0.0008;
const DRIFT_SPEED = 0.0003;
const DRIFT_AMOUNT = 4; // max pixels of drift
const FADE_SHARPNESS = 15;
const SPRITE_SIZE_COUNT = 8;
const SPRITE_PADDING = 2;
const GLOW_RADIUS = 0.08;
const TOOLTIP_THRESHOLD = 0.02;

interface StarSkyProps {
  stars: StarData[];
  uniqueDates: string[];
  earliestDate: string;
  totalContributions: number;
  scrollTriggerRef: React.RefObject<HTMLElement | null>;
}

function formatDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Pre-render star sprites at different sizes to offscreen canvases. */
function createStarSprites(): OffscreenCanvas[] {
  const minR = 1.8;
  const maxR = 3.5;
  const sprites: OffscreenCanvas[] = [];

  for (let i = 0; i < SPRITE_SIZE_COUNT; i++) {
    const t = i / (SPRITE_SIZE_COUNT - 1);
    const radius = minR + (maxR - minR) * t;
    const glowRadius = radius * 3;
    const dim = Math.ceil((glowRadius + SPRITE_PADDING) * 2);
    const canvas = new OffscreenCanvas(dim, dim);
    const ctx = canvas.getContext('2d')!;
    const cx = dim / 2;
    const cy = dim / 2;

    // Glow
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
    gradient.addColorStop(0, 'rgba(220, 225, 255, 0.9)');
    gradient.addColorStop(0.3, 'rgba(200, 210, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(200, 210, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dim, dim);

    // Core
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();

    sprites.push(canvas);
  }

  return sprites;
}

/** Map a star's size (0.3–1.0) to a sprite index. */
function spriteIndex(size: number): number {
  const t = (size - 0.3) / 0.7; // normalise to 0–1
  return Math.round(t * (SPRITE_SIZE_COUNT - 1));
}

const StarSky = ({
  stars,
  uniqueDates,
  earliestDate,
  totalContributions,
  scrollTriggerRef,
}: StarSkyProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const smoothRef = useRef(0);
  const prevRawRef = useRef(0);
  const velocityRef = useRef(0);
  const prevTimeRef = useRef(0);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const spritesRef = useRef<OffscreenCanvas[] | null>(null);
  const lastDateTextRef = useRef('');
  const lastCountTextRef = useRef('');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const localeRef = useRef('en');
  const { t, i18n } = useTranslation();

  // Sync locale into a ref so the RAF loop can read it without re-creation
  useEffect(() => {
    localeRef.current = i18n.language;
    lastDateTextRef.current = ''; // force date text re-render
  }, [i18n.language]);

  // Set up GSAP ScrollTrigger
  useGSAP(
    () => {
      if (!scrollTriggerRef.current) return;

      ScrollTrigger.create({
        trigger: scrollTriggerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    },
    { scope: scrollTriggerRef },
  );

  // Canvas sizing — use ResizeObserver so the bitmap updates immediately
  // when the CSS layout changes, avoiding stretched frames.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    sync();
    return () => ro.disconnect();
  }, []);

  // Mouse tracking on the section element
  useEffect(() => {
    const el = scrollTriggerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    const onLeave = () => {
      mouseRef.current = null;
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [scrollTriggerRef]);

  // Pre-compute sprite indices per star
  const spriteIndicesRef = useRef<Uint8Array | null>(null);
  useEffect(() => {
    if (stars.length === 0) return;
    const indices = new Uint8Array(stars.length);
    for (let i = 0; i < stars.length; i++) {
      indices[i] = spriteIndex(stars[i].size);
    }
    spriteIndicesRef.current = indices;
  }, [stars]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stars.length === 0) return;

    const ctx = canvas.getContext('2d')!;
    startTimeRef.current = performance.now();

    // Create sprites once
    if (!spritesRef.current) {
      spritesRef.current = createStarSprites();
    }
    const sprites = spritesRef.current;
    const indices = spriteIndicesRef.current!;

    // Pre-compute sprite half-sizes for positioning
    const spriteHalves = sprites.map((s) => s.width / 2);

    const MOMENTUM_DECAY = 0.95;
    const MOMENTUM_MAX_DRIFT = 0.03;
    const LERP_FAST = 18;
    const LERP_NORMAL = 8;

    const render = (time: number) => {
      const elapsed = time - startTimeRef.current;
      const dt = Math.min(
        (time - (prevTimeRef.current || time)) / 1000,
        0.05,
      );
      prevTimeRef.current = time;

      const raw = progressRef.current;
      const rawDelta = raw - prevRawRef.current;
      prevRawRef.current = raw;

      const atBoundary = raw <= 0 || raw >= 1;
      const gap = smoothRef.current - raw;
      // Scrolling backward (raw dropped below smooth) — kill momentum
      const scrollingBack = gap > 0.001;

      if (atBoundary || scrollingBack) {
        velocityRef.current = 0;
      } else if (Math.abs(rawDelta) > 0.00001) {
        // Only track positive (forward) velocity for momentum
        velocityRef.current =
          rawDelta > 0 ? rawDelta / Math.max(dt, 0.001) : 0;
      } else {
        velocityRef.current *= MOMENTUM_DECAY;
        if (Math.abs(velocityRef.current) < 0.01) velocityRef.current = 0;
      }

      // Target = raw + small forward drift from momentum (capped)
      let target = raw;
      if (
        !atBoundary &&
        !scrollingBack &&
        Math.abs(rawDelta) < 0.00001 &&
        velocityRef.current > 0.01
      ) {
        const drift = velocityRef.current * dt * 0.1;
        target = Math.min(raw + MOMENTUM_MAX_DRIFT, smoothRef.current + drift);
      }
      target = Math.max(0, Math.min(1, target));

      // Adaptive lerp: fast when far from target or scrolling back, gentle when close
      const lerpSpeed =
        Math.abs(target - smoothRef.current) > 0.02 ? LERP_FAST : LERP_NORMAL;
      smoothRef.current +=
        (target - smoothRef.current) * (1 - Math.exp(-lerpSpeed * dt));

      // Hard clamp: smooth can never be more than a tiny amount past raw
      smoothRef.current = Math.max(
        0,
        Math.min(1, Math.min(smoothRef.current, raw + MOMENTUM_MAX_DRIFT)),
      );

      // Scale progress so stars finish revealing at ~90% scroll,
      // leaving the last 10% as an empty buffer before unpin.
      const progress = Math.min(smoothRef.current / 0.8, 1);
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      const dateIndex = Math.min(
        Math.floor(progress * uniqueDates.length),
        uniqueDates.length - 1,
      );
      const currentDate =
        uniqueDates[Math.max(0, dateIndex)] ?? earliestDate;

      let visibleCount = 0;
      const mouse = mouseRef.current;
      let nearestDist = TOOLTIP_THRESHOLD;
      let nearestStar: StarData | null = null;
      let nearestScreenX = 0;
      let nearestScreenY = 0;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const reveal = (progress - star.threshold) * FADE_SHARPNESS;
        if (reveal <= 0) continue;

        const opacity = reveal < 1 ? reveal : 1;
        visibleCount++;

        // Twinkle for fully revealed stars
        let alpha =
          opacity >= 0.95
            ? 0.7 + 0.3 * Math.sin(elapsed * TWINKLE_SPEED + star.phase)
            : opacity;

        // Gentle floating drift — compute normalized drifted position
        const driftX = Math.sin(elapsed * DRIFT_SPEED + star.phase) * DRIFT_AMOUNT;
        const driftY = Math.cos(elapsed * DRIFT_SPEED * 0.7 + star.phase * 1.3) * DRIFT_AMOUNT;
        const driftedX = star.x + driftX / w;
        const driftedY = star.y + driftY / h;

        // Mouse glow + nearest-star scan (use drifted position)
        if (mouse) {
          const dx = driftedX - mouse.x;
          const dy = driftedY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < GLOW_RADIUS) {
            const boost = 1 - dist / GLOW_RADIUS;
            alpha = Math.min(1, alpha + boost * 0.5);
          }

          if (dist < nearestDist && opacity > 0) {
            nearestDist = dist;
            nearestStar = star;
            nearestScreenX = driftedX * w;
            nearestScreenY = driftedY * h;
          }
        }

        const sprite = sprites[indices[i]];
        const half = spriteHalves[indices[i]];
        const x = driftedX * w - half;
        const y = driftedY * h - half;

        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, x, y);
      }

      ctx.globalAlpha = 1;

      // Update tooltip
      const tooltip = tooltipRef.current;
      if (tooltip) {
        if (nearestStar) {
          const label = `${nearestStar.projectName} — ${formatDate(nearestStar.date, localeRef.current)}`;
          tooltip.textContent = label;
          tooltip.style.opacity = '1';
          tooltip.style.left = `${nearestScreenX}px`;
          tooltip.style.top = `${nearestScreenY - 24}px`;
        } else {
          tooltip.style.opacity = '0';
        }
      }

      // Update DOM text only when values change
      const countText = String(Math.min(visibleCount, totalContributions));
      if (countText !== lastCountTextRef.current) {
        lastCountTextRef.current = countText;
        if (countRef.current) countRef.current.textContent = countText;
      }

      if (currentDate !== lastDateTextRef.current) {
        lastDateTextRef.current = currentDate;
        if (dateRef.current) {
          dateRef.current.textContent = formatDate(
            currentDate,
            localeRef.current,
          );
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [stars, uniqueDates, earliestDate, totalContributions]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div
        ref={tooltipRef}
        className="absolute z-20 pointer-events-none select-none rounded bg-background/80 px-2 py-1 text-xs text-foreground whitespace-nowrap backdrop-blur-sm -translate-x-1/2 -translate-y-full transition-opacity duration-150"
        style={{ opacity: 0 }}
      />
      <div className="absolute bottom-27 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none">
        <p className="text-lg md:text-xl text-muted-foreground/80 tabular-nums">
          <span ref={countRef} className="font-semibold text-foreground">
            0
          </span>{' '}
          {t('projects.contributionsSince')}
        </p>
        <p
          ref={dateRef}
          className="text-2xl md:text-3xl font-bold mt-1 tabular-nums"
        />
      </div>
    </>
  );
};

export default StarSky;
