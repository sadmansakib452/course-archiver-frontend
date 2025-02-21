import { Metadata } from "next";
import TemplateList from "@/components/templates/TemplateList";

export const metadata: Metadata = {
  title: "File Templates | Course Archiver",
  description: "Manage course file templates",
};

export default function FileTemplatesPage() {
  return <TemplateList />;
}
