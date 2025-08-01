"use client";

import { BasecampCards } from "./basecamp-cards";

export function TestBasecampCards() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Testing Basecamp Cards</h2>
      <p className="text-muted-foreground">
        This component tests the Basecamp cards functionality for a specific test.
      </p>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Test ID: current-trips-001</h3>
        <BasecampCards testId="current-trips-001" />
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Test ID: survey-001</h3>
        <BasecampCards testId="survey-001" />
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Test ID: onsite-invoice-001</h3>
        <BasecampCards testId="onsite-invoice-001" />
      </div>
    </div>
  );
} 