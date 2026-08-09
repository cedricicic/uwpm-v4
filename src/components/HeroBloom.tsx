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

  uniform sampler2D uTexture;
  uniform vec2      uImgRes;
  uniform float     uHasTex;
  uniform float     uTitleTop;     // Top of title in UV (0..1 from bottom)
  uniform float     uTitleRight;   // Right edge of title in UV (0..1 from left)
  uniform float     uViewportMode; // 0.0 = Mobile (<768), 1.0 = Tablet (768-1023), 2.0 = Laptop (>=1024)

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

    // Aspect-ratio mapping for group photo background (no stretching)
    vec2 imgUv = vUv;
    bool inTex = false;

    if (uHasTex > 0.5) {
      float canvasAspect = uRes.x / uRes.y;
      float imgAspect = uImgRes.x / uImgRes.y;

      float targetW, targetH;
      float xMin, xMax, yMin, yMax;

      if (uViewportMode < 0.5) {
        // MOBILE ONLY (<768px): Image sits strictly in space ABOVE uTitleTop with a guaranteed gap.
        float safeBottom = min(0.75, uTitleTop + 0.035);
        float maxH = max(0.18, 0.95 - safeBottom);

        float computedW = maxH * imgAspect / canvasAspect;
        float maxW = min(0.88, 0.58 / canvasAspect);

        if (computedW > maxW) {
          targetW = maxW;
          targetH = targetW * canvasAspect / imgAspect;
        } else {
          targetW = computedW;
          targetH = min(maxH, targetW * canvasAspect / imgAspect);
        }

        xMax = 0.5 + targetW * 0.5;
        xMin = xMax - targetW;

        yMin = safeBottom;
        yMax = yMin + targetH;
      } else if (uViewportMode < 1.5) {
        // TABLET RANGE ONLY (768px <= w < 1024px): Position image on TOP RIGHT (slightly larger scale)
        targetH = (canvasAspect > 1.3) ? 0.54 : 0.50;
        targetW = targetH * imgAspect / canvasAspect;

        xMax = 0.95; // Right side
        xMin = xMax - targetW;

        yMax = 0.90; // Top side
        yMin = yMax - targetH;
      } else {
        // LAPTOP & DESKTOP (>=1024px): EXACT ORIGINAL AUTHORING
        targetH = 0.78;
        targetW = targetH * imgAspect / canvasAspect;

        xMax = 0.96;
        xMin = xMax - targetW;
        yMin = 0.5 - targetH * 0.5;
        yMax = yMin + targetH;
      }

      imgUv.x = (vUv.x - xMin) / targetW;
      imgUv.y = (vUv.y - yMin) / targetH;

      if (imgUv.x >= 0.0 && imgUv.x <= 1.0 && imgUv.y >= 0.0 && imgUv.y <= 1.0) {
        inTex = true;
      }
    }

    vec4 texColor = vec4(0.0);
    if (inTex) {
      texColor = texture2D(uTexture, imgUv);
    }

    float reveal = smoothstep(0.01, 0.75, col.a);
    float bgAlpha = inTex ? 0.05 * texColor.a : 0.0;
    float totalAlpha = max(col.a, bgAlpha);

    if (totalAlpha < 0.003) discard;

    vec3 rgb = col.rgb;
    if (inTex && texColor.a > 0.01) {
      vec3 photoRgb = texColor.rgb;

      // Lower contrast of the base image texture (compressing dynamic range toward mid-tone)
      photoRgb = clamp((photoRgb - vec3(0.5)) * 0.65 + vec3(0.5), 0.0, 1.0);

      // Gray + UWPM Red color scale ramp with lowered contrast extremes
      float lumi = dot(photoRgb, vec3(0.2126, 0.7152, 0.0722));
      vec3 grayColor = vec3(0.28, 0.29, 0.32);    // Softened dark slate gray
      vec3 uwpmRed   = vec3(0.95, 0.34, 0.37);   // Softened UWPM signal red
      vec3 highlight = vec3(0.91, 0.87, 0.88);    // Softened warm highlight

      vec3 colorScaleRgb;
      if (lumi < 0.5) {
        colorScaleRgb = mix(grayColor, uwpmRed, lumi * 2.0);
      } else {
        colorScaleRgb = mix(uwpmRed, highlight, (lumi - 0.5) * 2.0);
      }

      // Stylize the group photo with the gray + UWPM red color scale
      vec3 stylizedPhoto = mix(photoRgb, colorScaleRgb, 0.70);

      vec3 hexRgb = col.rgb;

      // Reveal photo inside the body of the hex bloom, blend into coral glow at edges
      rgb = mix(hexRgb, stylizedPhoto, reveal * texColor.a * 0.88);

      // Subtle ghost hint when outside active hex bloom
      if (col.a < 0.05) {
        rgb = mix(vec3(0.95), stylizedPhoto, 0.14);
      }
    }

    // Grain: refined high-frequency micro-grain at native pixel resolution
    vec2 cell = gl_FragCoord.xy;
    float n = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
    float speck = step(0.40, n) * step(n, 0.60) * totalAlpha * 0.20;
    vec4 finalCol = over(vec4(rgb, totalAlpha), vec3(1.0), speck);

    gl_FragColor = vec4(finalCol.rgb, finalCol.a * uIntro);
  }
`;

export default function HeroBloom() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
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
      uTexture: { value: null as THREE.Texture | null },
      uImgRes: { value: new THREE.Vector2(1, 1) },
      uHasTex: { value: 0 },
      uTitleTop: { value: 0.40 },
      uTitleRight: { value: 0.50 },
      uViewportMode: { value: 2 },
    };

    let loadedTexture: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.load("/prodcon/24/group.webp", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
      loadedTexture = tex;
      uniforms.uTexture.value = tex;
      uniforms.uImgRes.value.set(tex.image.width, tex.image.height);
      uniforms.uHasTex.value = 1;
      if (reduced || !visible) {
        renderer.render(scene, camera);
      }
    });

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

    const updateTitleBounds = () => {
      const heroRect = el.getBoundingClientRect();
      const titleEl = el.parentElement?.querySelector(".hero__title") || document.querySelector(".hero__title");
      if (titleEl && heroRect.height > 0 && heroRect.width > 0) {
        const titleRect = titleEl.getBoundingClientRect();

        const titleTopUv = Math.min(0.90, Math.max(0.05, (heroRect.bottom - titleRect.top) / heroRect.height));
        const titleRightUv = Math.min(0.90, Math.max(0.05, (titleRect.right - heroRect.left) / heroRect.width));

        const w = el.clientWidth;
        let mode = 0; // Mobile (< 768px)
        if (w >= 768 && w < 1024) {
          mode = 1; // Tablet range (768px <= w < 1024px)
        } else if (w >= 1024) {
          mode = 2; // Laptop / Desktop (>= 1024px)
        }

        uniforms.uTitleTop.value = titleTopUv;
        uniforms.uTitleRight.value = titleRightUv;
        uniforms.uViewportMode.value = mode;

        return { titleTopUv, titleRightUv, mode, w, h: heroRect.height };
      }
      return null;
    };

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * dpr, h * dpr);

      const bounds = updateTitleBounds();
      if (bounds) {
        if (bounds.mode === 0) {
          // Mobile (< 768px): Image sits strictly above title text
          const imageCenterY = Math.min(0.85, (bounds.titleTopUv + 0.035 + 0.96) / 2);
          uniforms.uScale.value = Math.max(w * 0.00102, h * 0.00112) * dpr;
          uniforms.uOrigin.value.set(w * 0.5 * dpr, h * imageCenterY * dpr);
        } else if (bounds.mode === 1) {
          // Tablet Range (768px <= w < 1024px): TOP RIGHT positioning (larger image & bloom)
          uniforms.uScale.value = Math.max(w * 0.00084, h * 0.00092) * dpr;
          uniforms.uOrigin.value.set(w * 0.72 * dpr, h * 0.65 * dpr);
        } else {
          // Laptop / Desktop (>= 1024px): EXACT ORIGINAL
          uniforms.uScale.value = Math.max(w * 0.00088, h * 0.00098) * dpr;
          uniforms.uOrigin.value.set(w * 0.71 * dpr, h * 0.56 * dpr);
        }
      }
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
      updateTitleBounds();
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
      if (loadedTexture) loadedTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="hero__bloom" ref={holder} aria-hidden="true" />;
}
