"use client";

import { useRouter } from "next/navigation";

const environments = [ "dev", "staging", "uat"];

export default function EnvSelect() {
  const router = useRouter();

  const handleSelect = (env: string) => {
    router.push(`/dashboard?environment=${env}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Select Environment to Monitor</h1>
      <div className="grid grid-cols-2 gap-4">
        {environments.map((env) => (
          <button
            disabled={env == "uat"}
            key={env}
            onClick={() => handleSelect(env)}
            className={`px-6 cursor-pointer py-4 ${env != "uat" ? `bg-blue-600 hover:bg-blue-700` : 'bg-black'} text-white rounded-lg transition`}
          >
            {env.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
