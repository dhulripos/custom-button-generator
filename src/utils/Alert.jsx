export default function Alert({ type, message, additionalClassName }) {
  const className = `alert alert-${type} ${additionalClassName}`;
  return <div className={className}>{message}</div>;
}
