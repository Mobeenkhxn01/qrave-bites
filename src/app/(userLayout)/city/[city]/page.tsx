import ToastClient from "./toast-client";

export const revalidate = 60;

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const resolved = await params;
  const city = decodeURIComponent(resolved.city);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <ToastClient noRestaurants={false} />

      <h1 className="text-3xl font-bold mb-6">
        Restaurants in <span className="text-red-600">{city}</span>
      </h1>

      <p className="text-gray-500 text-lg">
        Select a restaurant from the menu.
      </p>
    </div>
  );
}
