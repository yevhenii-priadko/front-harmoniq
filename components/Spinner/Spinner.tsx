import css from "./Spinner.module.css";

type SpinnerProps = {
  size?: number;
  color?: string;
  secondaryColor?: string;
  thickness?: number;
  className?: string;
  ariaLabel?: string;
};

// Простий CSS-спінер замість Oval з react-loader-spinner. Та бібліотека
// під капотом використовує styled-components, який під час SSR вставляє
// <style data-styled=""> прямо в тіло сторінки (усередині <main>) — це
// невалідний HTML (style дозволений лише в <head> або в <noscript> в
// <head>). Свій спінер на чистому CSS цієї проблеми не має.
export default function Spinner({
  size = 60,
  color = "var(--green)",
  secondaryColor = "#D1E0D8",
  thickness = 4,
  className,
  ariaLabel = "Loading",
}: SpinnerProps) {
  return (
    <span
      className={`${css.spinner} ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        borderColor: secondaryColor,
        borderTopColor: color,
      }}
      role="status"
      aria-label={ariaLabel}
    />
  );
}
