import { Globe, Sparkles, Zap } from "lucide-react";

export const environments = [
  {
    name: "uat",
    label: "UAT",
    description: "Live UAT environment",
    icon: Globe,
    color: "from-red-500 to-orange-600",
    bgColor: "from-red-50 to-orange-50",
    borderColor: "border-red-200 hover:border-red-400",
  },
  {
    name: "staging",
    label: "Staging",
    description: "Pre-production testing environment",
    icon: Sparkles,
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200 hover:border-blue-400",
  },
  {
    name: "dev",
    label: "Development",
    description: "Local development environment",
    icon: Zap,
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50",
    borderColor: "border-green-200 hover:border-green-400",
  },
];
