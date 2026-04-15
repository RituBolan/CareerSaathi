export default function Button({
  children,
  onClick,
  type = "button",
  style,
  variant = "primary",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant === "secondary" ? "btn-secondary" : "btn-primary"} disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      style={{
        ...style,
      }}
    >
      {children}
    </button>
  );
}
