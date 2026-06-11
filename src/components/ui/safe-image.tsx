"use client";

import { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export function SafeImage({ fallback, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  return (
    <img
      {...props}
      className={className}
      onError={() => setError(true)}
    />
  );
}
