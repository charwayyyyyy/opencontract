/**
 * DemoBanner
 * A persistent, subtle indicator that the environment uses demo/fictional data.
 * Should be visible but not distracting — fulfills the transparency requirement
 * of clearly labeling all simulated procurement records.
 */

import { FlaskConical } from "lucide-react";

export function DemoBanner() {
  return (
    <div
      role="banner"
      aria-label="Demo environment notice"
      className="w-full bg-[hsl(35,55%,94%)] border-b border-[hsl(35,40%,84%)] text-[hsl(35,50%,38%)]"
    >
      <div className="container-wide flex items-center justify-center gap-2 py-1.5">
        <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
        <p className="text-xs font-medium">
          DEMO DATA — These records are fictional examples used to demonstrate OpenContract&apos;s verification and transparency workflow.
        </p>
      </div>
    </div>
  );
}
