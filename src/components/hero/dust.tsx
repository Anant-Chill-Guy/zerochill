import type { CSSProperties } from "react";

const MOTES = [
  { left: "12%", top: "72%", size: 3, dur: 15, delay: 0, x: "40px", y: "-150px" },
  { left: "26%", top: "84%", size: 2, dur: 19, delay: 4, x: "70px", y: "-200px" },
  { left: "48%", top: "78%", size: 2.5, dur: 17, delay: 8, x: "-30px", y: "-180px" },
  { left: "63%", top: "88%", size: 2, dur: 21, delay: 2, x: "50px", y: "-220px" },
  { left: "78%", top: "74%", size: 3, dur: 16, delay: 6, x: "-60px", y: "-160px" },
  { left: "88%", top: "82%", size: 2, dur: 20, delay: 10, x: "30px", y: "-190px" },
] as const;

export function Dust() {
  return (
    <div className="dust-field z-10" aria-hidden="true">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="dust"
          style={
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              "--dust-duration": `${m.dur}s`,
              "--dust-delay": `${m.delay}s`,
              "--dust-x": m.x,
              "--dust-y": m.y,
              "--dust-opacity": 0.45,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
