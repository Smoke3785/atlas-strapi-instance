export type IconType = (
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "light"
  | "dark"
) & {};

export type IconProps = {
  className?: string;
  icon: JSX.Element;
  type?: IconType;
} & Record<string, unknown>;

export default function Icon({
  className,
  icon,
  type,
  color,
  ...props
}: IconProps) {
  let _className = "icon";

  if (className) {
    _className += ` ${className}`;
  }

  return (
    <div
      className={_className}
      data-color-type={type}
      data-icon-type={type}
      {...props}
    >
      {icon}
    </div>
  );
}

export { Icon };
