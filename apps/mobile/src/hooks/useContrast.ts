import React from 'react';
import { ContrastContext } from '@/components/primitives/Contrast/Contrast';

/**
 * Switches between contrast as a regular prop or as a context-provided prop
 * @param contrast The `contrast` prop
 * @returns Returns the contrast prop or a context-provided contrast
 */
export default function useContrast(contrast?: boolean) {
  const ctx = React.useContext(ContrastContext);
  if (ctx == null) return contrast ?? false;
  return ctx;
}
