"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The page's grid, rendered live. Dots sit on the same rhythm as the
 * hairlines behind the layout; they breathe on a slow diagonal wave and
 * swell toward the accent colour under the pointer. Devices without a
 * pointer get an autonomous attractor so the field still reads as alive.
 */

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

  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uPointer;
  uniform float uIntro;
  uniform float uSpacing;
  uniform float uRadius;
  uniform vec3 uInk;
  uniform vec3 uSignal;

  void main() {
    vec2 px = vUv * uRes;
    vec2 id = floor(px / uSpacing);
    vec2 center = (id + 0.5) * uSpacing;
    float d = distance(px, center);

    // Slow travelling wave so the field is never static.
    float w1 = sin(center.x * 0.0062 + center.y * 0.0046 - uTime * 0.5);
    float w2 = sin(center.y * 0.0093 + uTime * 0.31);
    float amb = 0.5 + 0.5 * (0.66 * w1 + 0.34 * w2);

    // Pointer falloff.
    float md = distance(center, uMouse);
    float infl = exp(-(md * md) / (2.0 * uRadius * uRadius)) * uPointer;

    // Intro sweeps out from the corner the headline sits in.
    float nd = distance(vUv, vec2(0.1, 0.16));
    float intro = clamp(uIntro * 2.3 - nd * 1.5, 0.0, 1.0);
    intro = intro * intro * (3.0 - 2.0 * intro);

    float radius = (0.85 + 0.8 * amb + 4.7 * infl) * intro;
    float mask = smoothstep(radius, radius - 1.15, d);

    float blend = clamp(infl * 2.2, 0.0, 1.0);
    vec3 col = mix(uInk, uSignal, blend);
    float alpha = mask * (0.24 + 0.15 * amb + 0.55 * blend);

    if (alpha < 0.002) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function HeroField() {
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
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uTime: { value: 0 },
      uPointer: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uSpacing: { value: 26 * dpr },
      uRadius: { value: 130 * dpr },
      uInk: { value: new THREE.Color("#000000") },
      uSignal: { value: new THREE.Color("#ff4d56") },
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
      const narrow = w < 720;
      uniforms.uSpacing.value = (narrow ? 22 : 26) * dpr;
      uniforms.uRadius.value = (narrow ? 96 : 130) * dpr;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Pointer target, smoothed toward each frame so the response trails.
    const target = new THREE.Vector2(-9999, -9999);
    let pointerTarget = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.set((e.clientX - r.left) * dpr, (r.bottom - e.clientY) * dpr);
      pointerTarget = 1;
    };
    const onLeave = () => {
      pointerTarget = 0;
    };

    if (canHover && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
    }

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(el);

    if (reduced) {
      uniforms.uPointer.value = 0;
      renderer.render(scene, camera);
      return () => {
        ro.disconnect();
        io.disconnect();
        renderer.dispose();
        el.removeChild(renderer.domElement);
      };
    }

    let raf = 0;
    let start = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!start) start = now;
      const t = (now - start) / 1000;
      uniforms.uTime.value = t;
      uniforms.uIntro.value = Math.min(1, t / 1.25);

      if (!canHover) {
        // Drift an attractor on a lissajous path for touch devices.
        const w = uniforms.uRes.value.x;
        const h = uniforms.uRes.value.y;
        target.set(
          w * (0.5 + 0.33 * Math.sin(t * 0.32)),
          h * (0.45 + 0.28 * Math.sin(t * 0.47 + 1.1))
        );
        pointerTarget = 0.75; // gentler than a deliberate cursor
      }

      uniforms.uMouse.value.lerp(target, 0.09);
      uniforms.uPointer.value +=
        (pointerTarget - uniforms.uPointer.value) * 0.06;

      if (visible) renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="hero__field" ref={holder} aria-hidden="true" />;
}
