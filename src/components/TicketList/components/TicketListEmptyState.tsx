import { memo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export const TicketListEmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <Search className="w-6 h-6 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium text-foreground mb-1">No tickets found</h3>
    <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
  </motion.div>
));

TicketListEmptyState.displayName = 'TicketListEmptyState';
