import Dashboard from "./Dashboard";

interface SearchParams {
  environment?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const environment = params?.environment || "local";

  return <Dashboard environment={environment} />;
}
