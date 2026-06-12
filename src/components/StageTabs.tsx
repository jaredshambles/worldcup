'use client'

import { STAGE_LABELS, STAGE_ORDER } from '@/lib/types'

interface StageTabsProps {
  activeStage: string
  onStageChange: (stage: string) => void
}

export function StageTabs({ activeStage, onStageChange }: StageTabsProps) {
  return (
    <div className="sticky top-14 z-40 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto">
        {STAGE_ORDER.map(stage => (
          <button
            key={stage}
            onClick={() => onStageChange(stage)}
            className={`
              px-3 py-3 text-sm font-medium whitespace-nowrap
              border-b-2 transition-colors
              ${
                activeStage === stage
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {STAGE_LABELS[stage]}
          </button>
        ))}
      </div>
    </div>
  )
}
