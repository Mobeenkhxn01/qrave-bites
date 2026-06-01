import RestaurantMenuClient from "./RestaurantMenuClient";

export default async function RestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string; slug: string }>;
  searchParams: Promise<{ tableId?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const city = decodeURIComponent(resolvedParams.city);
  const slug = decodeURIComponent(resolvedParams.slug);
  const tableId = resolvedSearchParams.tableId ?? null;

  return (
    <RestaurantMenuClient city={city} slug={slug} tableId={tableId} />
  );
}
