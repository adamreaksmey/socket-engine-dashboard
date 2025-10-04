"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import { environments } from "@/lib/data";


export default function EnvironmentSelector() {
  const [selected, setSelected] = useState<string>("");
  const router = useRouter();

  const handleConnect = () => {
    if (selected) {
      router.push(`/dashboard?environment=${selected}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                <Radio className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white">Auction - Socket Monitor</h1>
          <p className="text-xl text-slate-300">
            Select your environment to start monitoring
          </p>
        </div>

        {/* Environment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {environments.map((env) => {
            const Icon = env.icon;
            const isSelected = selected === env.name;

            return (
              <Card
                key={env.name}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? `ring-4 ring-white shadow-2xl scale-105 ${env.borderColor}`
                    : `${env.borderColor} hover:shadow-xl hover:scale-102`
                } bg-white/95 backdrop-blur-sm`}
                onClick={() => setSelected(env.name)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${env.bgColor}`}
                    >
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{env.label}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {env.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${env.color} opacity-20`}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Connect Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className={`px-8 py-6 text-lg font-semibold transition-all duration-300 ${
              selected
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-blue-500/50 scale-100 hover:scale-105"
                : "bg-slate-600 cursor-not-allowed opacity-50"
            }`}
            onClick={handleConnect}
            disabled={!selected}
          >
            {selected ? (
              <>
                Connect to{" "}
                {environments.find((e) => e.name === selected)?.label}
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            ) : (
              "Select an environment"
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            Real-time monitoring and analytics for WebSocket connections
          </p>
        </div>
      </div>
    </div>
  );
}
