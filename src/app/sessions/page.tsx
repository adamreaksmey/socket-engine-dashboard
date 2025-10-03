import Sessions from "./Sessions";

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

  return <Sessions environment={environment} />;
}

