import { AddToCartState, AddToCartButtonProps } from "@/app/types/index";
import {useAddToCartAnimation} from "@/app/components/Buttons/CartButton/AddToCartAnimation"
import { CartIcon, BoxIcon, CheckIcon } from "./icons";


export function AddToCartButton({
  onClick,
  ariaLabel = "Dodaj do koszyka",
  className = "",
  idleText = "Do koszyka",
  successText = "Dodano!",
}: AddToCartButtonProps) {
  const { state, handleClick, isDisabled } = useAddToCartAnimation({ onClick });

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={`
         group relative inline-flex items-center justify-center
        px-3 py-2
        rounded-lg
        text-sm font-medium text-white
        whitespace-nowrap
        transition-all duration-300 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        ${getBackgroundStyles(state)}
        ${className}
      `}
    >
      <CartIconAnimated state={state} />
      <BoxIconAnimated state={state} />
      <ButtonText state={state} idleText={idleText} successText={successText} />
    </button>
  );
}


function CartIconAnimated({ state }: { state: AddToCartState }) {
  return (
    <span
      className={`
        absolute left-3 transition-all duration-500 ease-out
        ${state === "idle" ? "opacity-100 translate-x-0" : ""}
        ${state === "adding" ? "opacity-100 translate-x-[4.5rem]" : ""}
        ${state === "success" ? "opacity-0 translate-x-24" : ""}
      `}
    >
      <CartIcon className="w-5 h-5" />
    </span>
  );
}

function BoxIconAnimated({ state }: { state: AddToCartState }) {
  return (
    <span
      className={`
        absolute transition-all duration-500 ease-out
        ${state === "idle" ? "opacity-0 right-5 translate-y-0" : ""}
        ${state === "adding" ? "opacity-100 right-[5.5rem] -translate-y-1 scale-75" : ""}
        ${state === "success" ? "opacity-0 right-24 translate-y-2 scale-50" : ""}
      `}
    >
      <BoxIcon className="w-4 h-4" />
    </span>
  );
}

function ButtonText({
  state,
  idleText,
  successText,
}: {
  state: AddToCartState;
  idleText: string;
  successText: string;
}) {
  return (
    <>
      {/* Idle Text */}
      <span
        className={`
          ml-7 transition-all duration-300
          ${state === "success" ? "opacity-0" : "opacity-100"}
        `}
      >
        {idleText}
      </span>

      {/* Success Text */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center gap-2
          transition-all duration-300
          ${state === "success" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <CheckIcon className="w-5 h-5" />
        {successText}
      </span>
    </>
  );
}

function getBackgroundStyles(state: AddToCartState): string {
  if (state === "success") {
    return "bg-emerald-600 hover:bg-emerald-600";
  }
  return "bg-blue-600 hover:bg-blue-700 active:bg-blue-800";
}

