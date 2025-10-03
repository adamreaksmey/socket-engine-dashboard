import Dashboard from "./Dashboard";

export default function Page({ searchParams }: { searchParams: { environment?: string } }) {
  return <Dashboard environment={searchParams.environment || "local"} />;
}
