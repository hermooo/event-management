import ComingSoon from "@/components/coming-soon";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return <ComingSoon error={error} />;
}
