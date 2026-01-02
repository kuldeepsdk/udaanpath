import OrganizationsTable from "./components/OrgTable";
import { fetchOrganizationsAction } from "@/app/actions/admin/organization.action";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function OrganizationsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const page = Number(params.page || 1);
  const status = params.status || "all";
  const q = params.q || "";

  const data = await fetchOrganizationsAction({
    page,
    status,
    q,
  });

  return (
    <OrganizationsTable
      organizations={data.organizations}
      total={data.total}
      page={page}
      limit={data.limit}
      status={status}
      q={q}
    />
  );
}
