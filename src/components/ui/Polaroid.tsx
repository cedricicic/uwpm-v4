import React from "react";
import Image from "next/image";

interface PolaroidProps {
  src: string;
  alt: string;
  caption: string;
  tilt?: "left" | "right" | "slight";
  sizes?: string;
}

export default function Polaroid({
  src,
  alt,
  caption,
  tilt = "slight",
  sizes = "380px",
}: PolaroidProps) {
  return (
    <div className={`polaroid-wrap polaroid-wrap--tilt-${tilt}`}>
      <div className="polaroid">
        <div className="polaroid__photo">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="polaroid__img"
          />
        </div>
        <p className="polaroid__caption">{caption}</p>
      </div>
    </div>
  );
}
