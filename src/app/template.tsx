"use client";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('Template: Rendering...');
  
  return (
    <ErrorBoundary>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {children}
      </div>
    </ErrorBoundary>
  );
} 