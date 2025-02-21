import { Metadata } from "next";
import TemplateStats from "@/components/templates/stats/TemplateStats";

export const metadata: Metadata = {
  title: "Template Statistics | Course Archiver",
  description: "View template usage statistics",
};

export default function TemplateStatsPage() {
  return <TemplateStats />;
} 