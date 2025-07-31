import QADashboardServer from "@/components/server/electric-dashboard/qa-dashboard-server";

/**
 * Main Page Component
 *
 * This page renders the QA Dashboard using the new refactored architecture.
 * The component uses server-side rendering with client-side data fetching.
 */
export default function Page() {
  return <QADashboardServer />;
}
