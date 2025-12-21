import { cn } from '@/lib/utils';
import type { OrgSettingsSection, OrgSettingsSectionId } from './types';

interface SectionNavProps {
  sections: OrgSettingsSection[];
  activeSection: OrgSettingsSectionId;
  onSelect: (section: OrgSettingsSectionId) => void;
}

export function OrgSettingsSectionNav({ sections, activeSection, onSelect }: SectionNavProps) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border/60 pb-2">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{section.label}</span>
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-2 -bottom-[7px] h-0.5 rounded-full',
                isActive ? 'bg-primary' : 'bg-transparent'
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
