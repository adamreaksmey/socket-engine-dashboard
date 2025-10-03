import Sessions from "./Sessions";

export default function Page({ searchParams }: { searchParams: { environment?: string } }) {
  return <Sessions environment={searchParams.environment || "local"} />;
}