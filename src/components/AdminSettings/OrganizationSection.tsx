import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface OrganizationSectionProps {
  orgName: string;
  inviteCode?: string;
  onOrgNameChange: (value: string) => void;
  onSave: () => Promise<void> | void;
  onCopyInvite: () => Promise<void> | void;
  saveDisabled: boolean;
}

export function OrganizationSection({
  orgName,
  inviteCode,
  onOrgNameChange,
  onSave,
  onCopyInvite,
  saveDisabled,
}: OrganizationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Organization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orgName">Name</Label>
          <div className="flex gap-2">
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => onOrgNameChange(e.target.value)}
              placeholder="Organization name"
            />
            <Button onClick={onSave} disabled={saveDisabled}>
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Invite Code</Label>
          <div className="flex items-center gap-2">
            <Input value={inviteCode || ''} readOnly className="font-mono" />
            <Button variant="outline" size="icon" onClick={onCopyInvite} title="Copy invite code">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
