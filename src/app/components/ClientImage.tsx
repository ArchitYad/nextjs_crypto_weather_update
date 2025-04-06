'use client';

import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function ClientImage({ src, alt, className }: Props) {
  const [showImage, setShowImage] = useState(true);

  if (!showImage) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setShowImage(false)}
    />
  );
}