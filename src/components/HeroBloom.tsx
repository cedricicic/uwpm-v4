"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The hero's bloom.
 *
 * The geometry is the Figma group verbatim: two identical stacks of five
 * concentric flat-top hexagons — the same shape the bar field is cut
 * from — each softened by a 28-unit blur, the inner three laid down
 * twice, then dusted with white grain clipped to the shape's own alpha.
 * It is rebuilt as a shader rather than dropped in as the exported still
 * for the one thing the still cannot do: the two clusters chase the
 * pointer on two different springs, so the pair pulls apart under a fast
 * cursor and folds back into the drawn composition when it settles.
 */

/** Figma artboard units. The group is 676 wide; everything below is
 *  measured from its centre so the two clusters stay antisymmetric. */
const AX = -78.922;
const AY = -48.115;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uRes;     // drawing buffer, device px
  uniform vec2  uOrigin;  // group centre, device px from bottom left
  uniform float uScale;   // device px per artboard unit
  uniform vec2  uA;       // cluster centres, artboard units
  uniform vec2  uB;
  uniform float uRotA;
  uniform float uRotB;
  uniform float uSwell;
  uniform float uIntro;
  uniform float uCell;    // device px per grain cell

  const float SIGMA = 28.0;

  // The five fills, in sRGB as authored — a raw shader writes straight
  // to the framebuffer, so nothing converts these on the way out.
  const vec3 C1 = vec3(1.0000, 0.7608, 0.7765);
  const vec3 C2 = vec3(0.9922, 0.5412, 0.5608);
  const vec3 C3 = vec3(1.0000, 0.3882, 0.4196);
  const vec3 C4 = vec3(1.0000, 0.3216, 0.3569);
  const vec3 C5 = vec3(1.0000, 0.3020, 0.3373);

  /** Flat top and bottom, vertices out to the left and right. R is the
   *  circumradius, so it matches the widths the design is drawn at. */
  float sdHex(vec2 p, float R) {
    const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
    float r = R * 0.866025404;
    p = abs(p);
    p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
    p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
    return length(p) * sign(p.y);
  }

  /** A gaussian blur of a straight edge is that edge's distance run
   *  through the normal CDF; the logistic curve stands in for it. */
  float cover(vec2 p, float R, float sigma) {
    return 1.0 / (1.0 + exp(1.702 * sdHex(p, R) / sigma));
  }

  vec4 over(vec4 dst, vec3 c, float a) {
    float o = a + dst.a * (1.0 - a);
    if (o <= 0.0) return vec4(0.0);
    return vec4((c * a + dst.rgb * dst.a * (1.0 - a)) / o, o);
  }

  vec4 cluster(vec4 dst, vec2 p, float rot) {
    float c = cos(rot), s = sin(rot);
    p = mat2(c, s, -s, c) * p / uSwell;
    float sigma = SIGMA / uSwell;

    float a1 = cover(p, 189.66, sigma);
    float a2 = cover(p, 143.05, sigma);
    float a3 = cover(p, 108.11, sigma);
    float a4 = cover(p,  82.22, sigma);
    float a5 = cover(p,  59.42, sigma);

    dst = over(dst, C1, a1);
    dst = over(dst, C2, a2);
    dst = over(dst, C3, a3);
    dst = over(dst, C4, a4);
    dst = over(dst, C5, a5);
    dst = over(dst, C3, a3); // the inner three are stacked twice, which
    dst = over(dst, C4, a4); // is what keeps the core reading as solid
    dst = over(dst, C5, a5); // against so much blur
    return dst;
  }

  void main() {
    vec2 p = (vUv * uRes - uOrigin) / uScale;

    vec4 col = vec4(0.0);
    col = cluster(col, p - uB, uRotB); // lower right sits underneath
    col = cluster(col, p - uA, uRotA);

    if (col.a < 0.003) discard;

    // Grain: white on about a quarter of the cells, held inside the
    // shape by the shape's own alpha.
    vec2 cell = floor(gl_FragCoord.xy / uCell);
    float n = fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
    float speck = step(0.34, n) * step(n, 0.58) * col.a * 0.85;
    col = over(col, vec3(1.0), speck);

    gl_FragColor = vec4(col.rgb, col.a * uIntro);
  }
`;

export default function HeroBloom() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      return; // No WebGL: the hero simply stays plain white.
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    renderer.setPixelRatio(dpr);
    renderer.setClearAlpha(0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uOrigin: { value: new THREE.Vector2(0, 0) },
      uScale: { value: 1 },
      uA: { value: new THREE.Vector2(AX, AY) },
      uB: { value: new THREE.Vector2(-AX, -AY) },
      uRotA: { value: 0 },
      uRotB: { value: 0 },
      uSwell: { value: 1 },
      uIntro: { value: reduced ? 1 : 0 },
      uCell: { value: dpr },
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthTest: false,
      })
    );
    scene.add(mesh);

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * dpr, h * dpr);

      const narrow = w < 760;
      // Big enough to carry the hero, but sized off the short edge too so
      // it never turns into a stripe on a tall phone.
      uniforms.uScale.value = Math.max(w * 0.00088, h * 0.00098) * dpr;
      uniforms.uOrigin.value.set(
        w * (narrow ? 0.6 : 0.71) * dpr,
        h * (narrow ? 0.52 : 0.56) * dpr
      );
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(el);

    if (reduced) {
      renderer.render(scene, camera);
      return () => {
        ro.disconnect();
        io.disconnect();
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
      };
    }

    // Pointer in artboard units, plus how much of it to believe.
    let mx = 0;
    let my = 0;
    let reach = 0;
    let reachTarget = 0;
    let press = 0;
    let pressTarget = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) * dpr - uniforms.uOrigin.value.x) / uniforms.uScale.value;
      my = ((r.bottom - e.clientY) * dpr - uniforms.uOrigin.value.y) / uniforms.uScale.value;
      reachTarget = 1;
    };
    const onLeave = () => {
      reachTarget = 0;
    };
    const onDown = () => {
      pressTarget = 1;
    };
    const onUp = () => {
      pressTarget = 0;
    };

    if (canHover) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      el.addEventListener("pointerleave", onLeave);
    }

    // The live positions, started where the design draws them.
    let ax = AX;
    let ay = AY;
    let bx = -AX;
    let by = -AY;

    let raf = 0;
    let start = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!start) start = now;
      const t = (now - start) / 1000;

      const intro = Math.min(1, t / 0.55);
      const eased = 1 - Math.pow(1 - intro, 4);
      uniforms.uIntro.value = eased;

      if (!canHover) {
        // No cursor to follow, so give it one on a slow lissajous.
        mx = 210 * Math.sin(t * 0.29);
        my = 150 * Math.sin(t * 0.41 + 1.1);
        reachTarget = 0.7;
      }

      reach += (reachTarget - reach) * 0.05;
      press += (pressTarget - press) * 0.12;

      // Each cluster wants its drawn place, drifting, pulled toward the
      // pointer by its own share. Different shares plus different spring
      // rates are what let the pair come apart.
      const wax = AX + 13 * Math.sin(t * 0.17) + 7 * Math.sin(t * 0.23 + 1.9);
      const way = AY + 11 * Math.cos(t * 0.21 + 0.6);
      const wbx = -AX + 12 * Math.sin(t * 0.19 + 2.4);
      const wby = -AY + 9 * Math.cos(t * 0.15 + 1.2);

      const tax = wax + (mx - wax) * 0.62 * reach;
      const tay = way + (my - way) * 0.62 * reach;
      const tbx = wbx + (mx - wbx) * 0.34 * reach;
      const tby = wby + (my - wby) * 0.34 * reach;

      ax += (tax - ax) * 0.085; // leads
      ay += (tay - ay) * 0.085;
      bx += (tbx - bx) * 0.042; // trails
      by += (tby - by) * 0.042;

      uniforms.uA.value.set(ax, ay);
      uniforms.uB.value.set(bx, by);

      // Corners are worth something: dragging a cluster off its mark
      // tips its hexagons, so the flick reads even where the blur doesn't.
      uniforms.uRotA.value = 0.1 * Math.sin(t * 0.11) + (ax - AX) * 0.0009;
      uniforms.uRotB.value =
        -0.085 * Math.sin(t * 0.13 + 0.8) - (bx + AX) * 0.0007;

      uniforms.uSwell.value =
        (0.88 + 0.12 * eased) * (1 + 0.09 * press + 0.03 * reach);

      if (visible) renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="hero__bloom" ref={holder} aria-hidden="true" />;
}
