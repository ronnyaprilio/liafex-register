interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}

export const NavItem = ({
  icon,
  label,
  onClick,
  danger = false,
}: NavItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer ${
      danger
        ? "hover:bg-red-500/20 text-red-100"
        : "hover:bg-white/10"
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);