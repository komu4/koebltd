import Link from "next/link";
import { clsx } from "clsx";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variants = {
  primary: "bg-brand-red text-white hover:bg-red-700",
  secondary: "bg-white text-brand-text hover:bg-brand-light border border-brand-border",
  dark: "bg-brand-dark text-white hover:bg-black",
};

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-button px-7 py-3.5 font-heading font-semibold text-sm tracking-wide transition-[transform,background-color,box-shadow,color] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.10)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
