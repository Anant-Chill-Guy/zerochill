import Image from "next/image";

import bgLayer2 from "@/assets/bg-layer-2.png";

export function DesertBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={bgLayer2}
          alt=""
          fill
          priority
          sizes="100vw"
          className="photo__img"
        />
      </div>
    </div>
  );
}
