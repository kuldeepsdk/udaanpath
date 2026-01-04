//app\actions\admin\organization.action.ts

"use server";

import {
  getApiBaseUrl,
  getAdminHeaders,
} from "@/app/actions/admin/_helpers";

import type { OrgStatus } from "@/app/types/admin";

/* ---------------------------------------
   Fetch Organizations (List + Filters)
--------------------------------------- */
export async function fetchOrganizationsAction({
  page,
  status,
  q,
}: {
  page: number;
  status?: string;
  q?: string;
}) {
  const params = new URLSearchParams({
    page: String(page || 1),
    status: status || "all",
    q: q || "",
  });

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/organizations?${params.toString()}`,
    {
      method: "GET",
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  const data = await res.json();
  console.log('fetchOrganizationsAction data : '+JSON.stringify(data))
  if (!res.ok || data?.success === false) {
    console.error("fetchOrganizationsAction failed:", data);
    throw new Error(data?.error || "Failed to fetch organizations");
  }


  return {
    organizations: data.organizations,
    total: data.total,
    limit: data.limit,
  };
}

/* ---------------------------------------
   Toggle Organization Status
--------------------------------------- */
export async function toggleOrgStatusAction(org_id: string) {
  if (!org_id) {
    throw new Error("Organization ID missing");
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/organizations/toggle-status`,
    {
      method: "POST",
      headers: {
        ...(await getAdminHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ org_id }),
      cache: "no-store",
    }
  );

  const data = await res.json();
  console.log('toggleOrgStatusAction response : '+JSON.stringify(data))
  if (!res.ok || data?.success === false) {
    console.error("toggleOrgStatusAction failed:", data);
    throw new Error(data?.error || "Failed to update organization status");
  }

  return data;
}

export async function updateOrgStatusAction(
  org_id: string,
  status: OrgStatus
) {
  if (!org_id) {
    throw new Error("Organization ID missing");
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/organizations/update-status`,
    {
      method: "POST",
      headers: {
        ...(await getAdminHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        org_id,
        status, // ✅ strictly 0 | 1 | 2
      }),
      cache: "no-store",
    }
  );

  const data = await res.json();
  
  if (!res.ok || data?.success !== true) {
    console.error("updateOrgStatusAction failed:", data);
    throw new Error(
      data?.error || "Failed to update organization status"
    );
  }

  return {
    success: true,
    org_id: data.org_id,
    old_status: data.old_status as OrgStatus,
    new_status: data.new_status as OrgStatus,
  };
}

/* =========================
   Fetch Org Details
========================= */

export async function getOrganizationDetailAction(orgId: string) {
  if (!orgId) {
    throw new Error("Organization ID missing");
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/organizations/${orgId}`,
    {
      method: "GET",
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  const text = await res.text();

  // 🔐 protect against empty / invalid JSON
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Invalid API response");
  }

  if (!res.ok || !data?.success) {
    console.log("getOrganizationDetailAction failed:"+JSON.stringify(data));
    throw new Error(data?.error || "Failed to load organization");
  }

  return data;
}



/* =========================
   Assign Credits
========================= */
export async function assignOrgCreditsAction(
  orgId: string,
  credits: number,
  remarks?: string
) {
  if (!orgId || credits <= 0) {
    throw new Error("Invalid input");
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/organizations/${orgId}/assign-credits`,
    {
      method: "POST",
      headers: {
        ...(await getAdminHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credits, remarks }),
      cache: "no-store",
    }
  );
  console.log('assignOrgCreditsAction res : '+JSON.stringify(res));
  const data = await res.json();

  if (!res.ok || !data?.success) {
    throw new Error(data?.error || "Failed to assign credits");
  }

  return data;
}
