import CommandSearch from "./CommandSearch";
import RoleSwitcher from "./RoleSwitcher";

export default function TopNav() {
  return (
    <header className="h-16 shrink-0 border-b border-border bg-surface flex items-center justify-between px-6 gap-4">
      <CommandSearch />
      <RoleSwitcher />
    </header>
  );
}
