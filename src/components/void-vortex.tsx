export function VoidVortex({ className = "" }: { className?: string }) {
  return (
    <span className={`vortex ${className}`} aria-hidden="true">
      <span className="vortex__bloom" />
      <span className="vortex__tilt">
        <span className="vortex__fade">
          <span className="vortex__disk" />
          <span className="vortex__disk vortex__disk--hot" />
        </span>
        <span className="vortex__core" />
        <span className="vortex__photon" />
      </span>
      <span className="vortex__ring" />
    </span>
  );
}
