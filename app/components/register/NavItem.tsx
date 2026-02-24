export const NavItem = ({ icon, label, danger=false }: any) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer ${
    danger ? "hover:bg-red-500/20 text-red-100" : "hover:bg-white/10"
  }`}>
    {icon}
    <span>{label}</span>
  </div>
);