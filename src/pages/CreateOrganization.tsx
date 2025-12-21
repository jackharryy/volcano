import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrganization } from '@/lib/organizationHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorHelpers';

export default function CreateOrganization() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const org = await createOrganization(name);
      toast.success(`Organization created! Invite code: ${org.invite_code}`);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create organization'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>
            Set up your organization and get an invite code to share with your team
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleCreate}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Acme Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
