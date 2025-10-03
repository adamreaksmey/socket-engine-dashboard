import Events from "./Events";

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

  return <Events environment={environment} />;
}

