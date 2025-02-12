"use client";
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Welcome back, {user?.name}!
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Add your dashboard widgets/cards here */}
      </div>
    </div>
  );
} 