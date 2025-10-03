import Events from "./Events";

export default function Page({ searchParams }: { searchParams: { environment?: string } }) {
  return <Events environment={searchParams.environment || "local"} />;
}
