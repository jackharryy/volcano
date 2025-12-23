import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrganizationSetupProps {
  userName: string;
  userEmail: string;
  onLogout: () => Promise<void> | void;
  onCreateOrg: (name: string) => Promise<void>;
  onJoinOrg: (code: string) => Promise<void>;
}

export function OrganizationSetup({ userName, userEmail, onLogout, onCreateOrg, onJoinOrg }: OrganizationSetupProps) {
  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateOrg(orgName);
      setOrgName('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onJoinOrg(inviteCode);
      setInviteCode('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative">
      <div className="absolute top-6 right-6 flex items-center gap-3 text-gray-100">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium">{userName}</p>
          {userEmail && <p className="text-xs text-gray-400">{userEmail}</p>}
        </div>
        <Button variant="outline" size="sm" className="border-border text-foreground" onClick={onLogout}>
          Logout
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Volcano</CardTitle>
          <CardDescription>Get started by creating or joining an organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={mode} value={mode} onValueChange={(value) => setMode(value as 'create' | 'join')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="join">Join</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    type="text"
                    placeholder="Acme Inc."
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !orgName.trim()}>
                  {submitting && mode === 'create' ? 'Creating...' : 'Create Organization'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="join">
              <form onSubmit={handleJoin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="ABC12345"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                    maxLength={8}
                    className="font-mono text-lg tracking-wider"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || inviteCode.length < 6}>
                  {submitting && mode === 'join' ? 'Joining...' : 'Join Organization'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
