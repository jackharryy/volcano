import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { teams } from '@/data/mockData';
import { Priority } from '@/types/ticket';
import { cn } from '@/lib/utils';

interface QuickSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => void;
}

interface SubmitData {
  title: string;
  description: string;
  reporterEmail: string;
  category: string;
  priority: Priority;
}

const categories = [
  'Bug',
  'Feature Request',
  'Performance',
  'Infrastructure',
  'Security',
  'Other',
];

const priorities: { id: Priority; label: string; color: string }[] = [
  { id: 'urgent', label: 'Urgent', color: 'bg-destructive' },
  { id: 'high', label: 'High', color: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'low', label: 'Low', color: 'bg-primary' },
];

export function QuickSubmitModal({ isOpen, onClose, onSubmit }: QuickSubmitModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [category, setCategory] = useState('Bug');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({
      title,
      description,
      reporterEmail,
      category,
      priority,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setReporterEmail('');
    setCategory('Bug');
    setPriority('medium');
    setIsSubmitting(false);
    onClose();
  };

  const isValid = title.trim() && description.trim() && reporterEmail.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card-elevated p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Report a problem</h2>
                <p className="text-sm text-muted-foreground">Quick & anonymous submission</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the issue, steps to reproduce, expected behavior..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Your Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                  >
                    {priorities.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 10MB per file
                  </p>
                </div>
              </div>

              {/* AI Notice */}
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <Sparkles className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <p className="text-xs text-secondary">
                  AI will automatically suggest the best team and provide a triage summary
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="flex-1 gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
