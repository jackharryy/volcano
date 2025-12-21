import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TicketListLoadingState = memo(() => (
  <div className="space-y-4">
    <div className="hidden lg:block space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="grid grid-cols-12 gap-3 px-3 py-3 border border-border/60 rounded-lg">
          <Skeleton className="col-span-1 h-4" />
          <Skeleton className="col-span-3 h-4" />
          <Skeleton className="col-span-1 h-4" />
          <Skeleton className="col-span-1 h-4" />
          <Skeleton className="col-span-2 h-4" />
          <Skeleton className="col-span-2 h-4" />
          <Skeleton className="col-span-1 h-4" />
          <Skeleton className="col-span-1 h-4" />
        </div>
      ))}
    </div>
    <div className="lg:hidden space-y-3">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-3 rounded-lg border border-border/60 bg-card/70 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  </div>
));

TicketListLoadingState.displayName = 'TicketListLoadingState';
