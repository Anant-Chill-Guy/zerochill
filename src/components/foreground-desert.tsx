import Image from "next/image";

import layer1 from "@/assets/layer-1-fg.webp";

export function ForegroundDesert() {
  return (
    <div className="w-full">
      <Image
        src={layer1}
        alt=""
        priority
        sizes="100vw"
        className="foreground__img block h-auto w-full select-none"
      />
    </div>
  );
}
