"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HOLD_VH = 210;
const MINI = 0.21;
const TEX = {
  day: "/media/earth-day.jpg",
  night: "/media/earth-night.jpg",
  normal: "/media/earth-normal.jpg",
};

const CALLOUTS = 2;

export function Globe() {
  const root = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pinEls = useRef<(HTMLDivElement | null)[]>([]);
  const leadEls = useRef<(SVGPolylineElement | null)[]>([]);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const codeEls = useRef<(HTMLElement | null)[]>([]);
  const coordEls = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const NODES = content.globe.nodes as readonly (readonly [number, number])[];
    const deg2rad = Math.PI / 180;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10000);
    camera.position.set(0, 0, 5000);
    camera.lookAt(0, 0, 0);

    const tilt = new THREE.Group();
    tilt.rotation.z = -18 * deg2rad;
    tilt.rotation.x = 6 * deg2rad;
    scene.add(tilt);
    const spin = new THREE.Group();
    tilt.add(spin);

    let coverR = 1;
    let miniR = 1;
    let lastR = 0;
    let lastLon = 0;
    let vw = 1;
    let vh = 1;
    const slots: (THREE.Object3D | null)[] = new Array(CALLOUTS).fill(null);
    const tmp = new THREE.Vector3();

    // one number drives the whole beat
    const draw = (r: number, lon0: number) => {
      lastR = r;
      lastLon = lon0;
      const R = coverR + (miniR - coverR) * r;
      tilt.scale.setScalar(R);
      spin.rotation.y = lon0 * deg2rad;
      starMat.opacity = THREE.MathUtils.smoothstep(r, 0.04, 0.4);
      renderer.render(scene, camera);
      placeCallouts(r);
    };

    const EX = 34;
    const EY = 48;
    const HOUT = 132;
    const LEAD = Math.hypot(EX, EY) + HOUT;
    const placeCallouts = (r: number) => {
      const cx = vw / 2;
      for (let i = 0; i < CALLOUTS; i++) {
        const obj = slots[i];
        const pinEl = pinEls.current[i];
        if (!pinEl) continue;
        if (!obj) {
          pinEl.style.opacity = "0";
          continue;
        }

        obj.getWorldPosition(tmp);
        const frontZ = tmp.clone().normalize().z;
        tmp.project(camera);
        const x = (tmp.x * 0.5 + 0.5) * vw;
        const y = (-tmp.y * 0.5 + 0.5) * vh;
        pinEl.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;

        const sx = x >= cx ? 1 : -1;
        const e1x = sx * EX;
        const e2x = sx * (EX + HOUT);
        const ey = -EY;

        const t0 = 0.5 + i * 0.08;
        const lineP = THREE.MathUtils.smoothstep(r, t0, t0 + 0.14);
        const lblP = THREE.MathUtils.smoothstep(r, t0 + 0.1, t0 + 0.24);
        const front = THREE.MathUtils.smoothstep(frontZ, 0.05, 0.22);
        pinEl.style.opacity = front.toFixed(3);

        const lead = leadEls.current[i];
        if (lead) {
          lead.setAttribute(
            "points",
            `200,200 ${(200 + e1x).toFixed(1)},${(200 + ey).toFixed(1)} ${(200 + e2x).toFixed(1)},${(200 + ey).toFixed(1)}`,
          );
          lead.style.strokeDasharray = `${LEAD.toFixed(1)}`;
          lead.style.strokeDashoffset = (LEAD * (1 - lineP)).toFixed(1);
        }

        const card = cardEls.current[i];
        if (card) {
          card.style.left = `${Math.min(e1x, e2x).toFixed(1)}px`;
          card.style.top = `${ey.toFixed(1)}px`;
          card.style.transform = `translate(0, calc(-100% - ${(3 + (1 - lblP) * 6).toFixed(1)}px))`;
          card.style.opacity = lblP.toFixed(3);
        }
      }
    };

    const geo = new THREE.SphereGeometry(1, 96, 96);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const load = (src: string, srgb: boolean) => {
      // repaint once the texture arrives
      const t = loader.load(src, () => draw(lastR, lastLon));
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = maxAniso;
      return t;
    };
    const dayMap = load(TEX.day, true);
    const nightMap = load(TEX.night, true);
    const normalMap = load(TEX.normal, false);

    const mat = new THREE.MeshStandardMaterial({
      map: dayMap,
      normalMap,
      emissiveMap: nightMap,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.55,
      metalness: 0.0,
      roughness: 0.92,
    });
    const earth = new THREE.Mesh(geo, mat);
    spin.add(earth);

    // key light from the upper left
    const sun = new THREE.DirectionalLight(0xfff1dc, 3.1);
    sun.position.set(-1.4, 0.6, 1.1);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x2a3446, 0.16));

    const STAR_COUNT = 1400;
    const STAR_RADIUS = 3000;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      // scatter uniformly on the shell
      const z = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const ring = Math.sqrt(1 - z * z);
      starPos[i * 3] = Math.cos(a) * ring * STAR_RADIUS;
      starPos[i * 3 + 1] = z * STAR_RADIUS;
      starPos[i * 3 + 2] = Math.sin(a) * ring * STAR_RADIUS;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // place a pin at each entrant
    const pinGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xf9b637 });
    const LON0 = -90;
    const pinMeshes: THREE.Mesh[] = [];
    for (const [lat, lon] of NODES) {
      const phi = (90 - lat) * deg2rad;
      const theta = (lon + LON0) * deg2rad;
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta),
      );
      pin.position.multiplyScalar(1.005);
      spin.add(pin);
      pinMeshes.push(pin);
    }

    if (pinMeshes.length) {
      spin.rotation.y = content.globe.turns * 360 * deg2rad;
      scene.updateMatrixWorld(true);

      const toScreen = (obj: THREE.Object3D) => {
        obj.getWorldPosition(tmp);
        const front = tmp.clone().normalize().z;
        tmp.project(camera);
        return { front, sx: tmp.x, sy: tmp.y };
      };

      const faceOn = pinMeshes
        .map((pin, i) => ({ i, ...toScreen(pin) }))
        .filter((c) => c.front > 0.2);

      const upper = faceOn.filter((c) => c.sy > 0.05);
      const pool = upper.length >= CALLOUTS ? upper : faceOn;
      pool.sort((a, b) => a.sx - b.sx);

      const chosen: typeof pool = [];
      if (pool.length) chosen.push(pool[0]);
      if (pool.length > 1) chosen.push(pool[pool.length - 1]);

      spin.rotation.y = 0;

      const fmt = (v: number, pos: string, neg: string) =>
        `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`;
      chosen.forEach((c, slot) => {
        slots[slot] = pinMeshes[c.i];
        const [flat, flon] = NODES[c.i];
        const code = codeEls.current[slot];
        const coord = coordEls.current[slot];
        if (code) code.textContent = `ENTRANT_${String(c.i + 1).padStart(2, "0")}`;
        if (coord) coord.textContent = `${fmt(flat, "N", "S")} · ${fmt(flon, "E", "W")}`;
      });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      vw = w;
      vh = h;
      renderer.setSize(w, h, false);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      coverR = Math.hypot(w, h) / 2;
      miniR = Math.min(w, h) * MINI;
      draw(lastR, lastLon);
    };

    resize();
    const io = new ResizeObserver(resize);
    io.observe(canvas);

    const api = { draw, resize };
    (canvas as unknown as { __globe: typeof api }).__globe = api;

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      geo.dispose();
      pinGeo.dispose();
      starGeo.dispose();
      mat.dispose();
      pinMat.dispose();
      starMat.dispose();
      dayMap.dispose();
      nightMap.dispose();
      normalMap.dispose();
      renderer.dispose();
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q(".seq__stage")[0] as HTMLElement;
      const canvas = canvasRef.current;
      if (!stage || !canvas) return;

      // resolve the renderer api lazily since useGSAP runs before passive effects
      type GlobeApi = { draw: (r: number, lon: number) => void; resize: () => void };
      const getApi = () =>
        (canvas as unknown as { __globe?: GlobeApi }).__globe;
      const whenReady = (fn: (a: GlobeApi) => void, tries = 12) => {
        const a = getApi();
        if (a) fn(a);
        else if (tries > 0) requestAnimationFrame(() => whenReady(fn, tries - 1));
      };

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        whenReady((a) => a.draw(1, 0));
        gsap.set(q(".glb__canvas-wrap"), { autoAlpha: 1 });
        gsap.set(q(".glb__copy"), { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(q(".glb__canvas-wrap"), { autoAlpha: 0 });

      const s = { r: 0, lon: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${HOLD_VH}%`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => getApi()?.resize(),
        },
      });

      tl.to(q(".glb__canvas-wrap"), { autoAlpha: 1, duration: 0.1 }, 0);

      tl.to(
        s,
        {
          r: 1,
          lon: content.globe.turns * 360,
          duration: 0.52,
          ease: "power2.inOut",
          onUpdate: () => getApi()?.draw(s.r, s.lon),
        },
        0.06,
      );

      tl.fromTo(
        q(".glb__copy"),
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" },
        0.5,
      );

      tl.to(q(".glb__veil"), { autoAlpha: 1, duration: 0.22 }, 0.78);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="seq" aria-labelledby="glb-heading">
      <div className="seq__stage">
        <div className="glb__canvas-wrap">
          <canvas ref={canvasRef} className="glb__canvas" aria-hidden="true" />

          {Array.from({ length: CALLOUTS }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                pinEls.current[i] = el;
              }}
              className="glb__pin"
              aria-hidden="true"
            >
              <svg
                className="glb__pin-svg"
                viewBox="0 0 400 400"
                width="400"
                height="400"
              >
                <polyline
                  ref={(el) => {
                    leadEls.current[i] = el;
                  }}
                  className="glb__pin-lead"
                  points="200,200 200,200"
                />
                <circle className="glb__pin-dot" cx="200" cy="200" r="2.4" />
              </svg>
              <div
                ref={(el) => {
                  cardEls.current[i] = el;
                }}
                className="glb__pin-card"
              >
                <span
                  ref={(el) => {
                    codeEls.current[i] = el;
                  }}
                  className="glb__pin-code"
                />
                <span
                  ref={(el) => {
                    coordEls.current[i] = el;
                  }}
                  className="glb__pin-coord"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="glb__copy">
          <div>
            <span className="seq__eyebrow">{content.globe.eyebrow}</span>
            <h2 id="glb-heading" className="glb__headline">
              {content.globe.headline}
            </h2>
          </div>
          <p className="glb__body">{content.globe.body}</p>
        </div>

        <div className="glb__veil" aria-hidden="true" />
      </div>
    </section>
  );
}
