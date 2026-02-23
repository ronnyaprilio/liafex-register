// app/(pos)/page.tsx

import { ActionBar } from "@/app/components/register/ActionBar";
import { CategoryGrid } from "@/app/components/register/CategoryGrid";
import { ReceiptPanel } from "@/app/components/register/ReceiptPanel";

export default function POSPage() {
  return (
    <div className="flex h-full bg-gray-100">

      <ReceiptPanel />

      <div className="flex flex-col flex-1 overflow-hidden">
        <CategoryGrid />
        <ActionBar />
      </div>

    </div>
  );
}