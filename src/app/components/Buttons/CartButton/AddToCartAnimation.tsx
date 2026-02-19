import { useState, useCallback } from "react";
import {UseAddToCartAnimationOptions, UseAddToCartAnimationReturn, AddToCartState } from '@/app/types/index'

export function useAddToCartAnimation({
  onClick,
  addingDuration = 600,
  successDuration = 1600,
}: UseAddToCartAnimationOptions = {}): UseAddToCartAnimationReturn {
  const [state, setState] = useState<AddToCartState>("idle");

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    e.stopPropagation();
    
    if (state !== "idle") return;

    setState("adding");
    onClick?.(e);

    setTimeout(() => {
      setState("success");
    }, addingDuration);

    setTimeout(() => {
      setState("idle");
    }, addingDuration + successDuration);
  }, [state, onClick, addingDuration, successDuration]);

  return {
    state,
    handleClick,
    isDisabled: state !== "idle",
  };
}
