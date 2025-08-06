"use client";

interface HeaderSectionProps {
  // Removed user switching functionality
}

export function HeaderSection({}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          MTP Application QA Plan
        </h1>
      </div>
    </div>
  );
}
