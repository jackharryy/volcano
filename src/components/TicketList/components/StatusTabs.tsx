import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { StatusTabsProps } from '../types';

export const StatusTabs = memo(({ tabs, activeKey, onChange }: StatusTabsProps) => (
  <div className="flex items-center gap-1 flex-wrap">
    {tabs.map((tab) => {
      const isActive = activeKey === tab.key;
      return (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'relative px-3 py-2 text-sm font-medium transition-colors border-b-2',
            isActive
              ? 'text-foreground border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
          )}
        >
          <span>{tab.label}</span>
          <span
            className={cn(
              'ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] border',
              isActive ? 'border-primary/50 text-foreground' : 'border-border text-muted-foreground'
            )}
          >
            {tab.count}
          </span>
          {isActive && <span className="absolute left-0 right-0 -bottom-[2px] h-0.5 bg-primary" aria-hidden />}
        </button>
      );
    })}
  </div>
));

StatusTabs.displayName = 'StatusTabs';
