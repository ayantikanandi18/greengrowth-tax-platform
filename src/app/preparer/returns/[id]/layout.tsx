import { notFound } from "next/navigation";
import { clientDisplayName, getReturn } from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import ReturnTabs from "./ReturnTabs";

export default async function ReturnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taxReturn = getReturn(id);
  if (!taxReturn) notFound();

  return (
    <div>
      <PageHeader
        title={clientDisplayName(taxReturn.clientId)}
        crumbs={[
          { label: "Dashboard", href: "/preparer" },
          { label: clientDisplayName(taxReturn.clientId) },
        ]}
        subtitle={`${taxReturn.taxYear} · ${taxReturn.formType} · Due ${new Date(taxReturn.dueDate).toLocaleDateString()}`}
        actions={<StatusPill status={taxReturn.status} audience="staff" />}
      />
      <ReturnTabs returnId={id} />
      {children}
    </div>
  );
}
