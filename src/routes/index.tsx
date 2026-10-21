import { createFileRoute } from "@tanstack/react-router";
import { ClinicApp } from "@/components/clinic/shell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ClinicApp />;
}
