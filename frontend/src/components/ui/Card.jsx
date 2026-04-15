export default function Card({ children, title, style }) {
  return (
    <div
      className="card relative"
      style={{
        ...style,
      }}
    >
      {title ? (
        <h3 className="headline-font mb-4 text-lg font-semibold text-white">
          {title}
        </h3>
      ) : null}

      {children}
    </div>
  );
}
