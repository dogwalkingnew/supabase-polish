import { ChevronRight } from "lucide-react";

interface SectionTitleProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionTitle = ({ title, actionLabel, onAction }: SectionTitleProps) => (
  <div className="flex items-end justify-between mb-3 px-1">
    <h2 className="text-xl font-bold text-[#1A1A2E] tracking-tight">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-sm font-semibold text-[#10B981] hover:underline inline-flex items-center gap-0.5">
        {actionLabel}
        <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default SectionTitle;
