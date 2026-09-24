import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProcurementByOcid } from "@/services/procurement/queries";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContractDetail } from "@/components/procurement/contract-detail";

interface PageProps {
  params: Promise<{ ocid: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ocid } = await params;
  const procurement = await getProcurementByOcid(ocid);

  if (!procurement) {
    return { title: "Contract not found" };
  }

  return {
    title: procurement.title,
    description:
      `Public procurement record — ${procurement.procuringEntity.name}. ` +
      `Status: ${procurement.status}. OCID: ${procurement.ocid}.`,
  };
}

export default async function ContractPage({ params }: PageProps) {
  const { ocid } = await params;
  const procurement = await getProcurementByOcid(ocid);

  if (!procurement) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main>
        <ContractDetail procurement={procurement} />
      </main>
      <SiteFooter />
    </>
  );
}
