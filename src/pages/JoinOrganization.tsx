import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinOrganization } from '@/lib/organizationHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorHelpers';

export default function JoinOrganization() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await joinOrganization(inviteCode.toUpperCase());
      toast.success('Successfully joined organization!');
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to join organization'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Organization</CardTitle>
          <CardDescription>
            Enter the invite code shared by your organization admin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleJoin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Joining...' : 'Join Organization'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
