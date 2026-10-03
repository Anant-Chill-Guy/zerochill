"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* A wireframe dune field, drawn in the page's orange the way the preloader
   draws the facility. The dunes are displaced in the vertex shader, so a frame
   costs one draw call and nothing is rebuilt on the CPU. The loop only runs
   while the canvas is on screen, and reduced motion gets a single still frame. */

const VERT = /* glsl */ `
  uniform float uTime;
  varying float vDepth;

  float dune(vec2 p, float t) {
    return sin(p.x * 0.32 + t * 0.12) * 0.7
         + sin(p.y * 0.45 - t * 0.08 + p.x * 0.18) * 0.45
         + sin((p.x + p.y) * 0.9 + t * 0.05) * 0.12;
  }

  void main() {
    vec3 p = position;
    p.z += dune(p.xy, uTime);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vDepth;

  void main() {
    // fade out with distance so the field dissolves into the stage
    float a = smoothstep(26.0, 4.0, vDepth) * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function DuneField() {
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = wrap.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.className = "sp-dunes__canvas";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
    camera.position.set(0, 2.4, 7);
    camera.lookAt(0, 0.4, -6);

    // the accent follows the palette in force when the page mounts
    const ink = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-tangerine")
      .trim();

    const geometry = new THREE.PlaneGeometry(48, 32, 96, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(ink || "#fb6c00") },
        uOpacity: { value: 0.55 },
      },
      wireframe: true,
      transparent: true,
      depthWrite: false,
    });
    const field = new THREE.Mesh(geometry, material);
    field.rotation.x = -Math.PI / 2;
    field.position.z = -10;
    scene.add(field);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = new THREE.Timer();
    let visible = true;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    if (!still) {
      renderer.setAnimationLoop(() => {
        if (!visible) return;
        timer.update();
        material.uniforms.uTime.value = timer.getElapsed();
        renderer.render(scene, camera);
      });
    }

    return () => {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrap} className="sp-dunes" aria-hidden="true" />;
}
