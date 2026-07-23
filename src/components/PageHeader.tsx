import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export default function PageHeader({
  title,
  crumbs,
  actions,
  subtitle,
}: {
  title: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="px-8 pt-6 pb-4 border-b border-border bg-surface">
      {crumbs && crumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-2">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-ink hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink-secondary">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
    </div>
  );
}
