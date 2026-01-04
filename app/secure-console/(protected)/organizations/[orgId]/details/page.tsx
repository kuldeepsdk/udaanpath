import { getOrganizationDetailAction } from "@/app/actions/admin/organization.action";
import OrganizationDetailClient from "./OrganizationDetailClient";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;

  const data = await getOrganizationDetailAction(orgId);

  return (
    <OrganizationDetailClient
      orgId={orgId}
      initialData={data}
    />
  );
}
