import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { OrganizationMember } from '@/types/organization';

interface UsersSectionProps {
  members: OrganizationMember[];
  loadingMembers: boolean;
  onToggleRole: (member: OrganizationMember) => Promise<void> | void;
  onRemoveMember: (member: OrganizationMember) => Promise<void> | void;
}

export function UsersSection({ members, loadingMembers, onToggleRole, onRemoveMember }: UsersSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Users</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-72 overflow-y-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium">User</th>
                <th className="text-left px-3 py-2 font-medium">Role</th>
                <th className="text-right px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingMembers && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">
                    Loading members...
                  </td>
                </tr>
              )}
              {!loadingMembers && members.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">
                    No members found.
                  </td>
                </tr>
              )}
              {!loadingMembers &&
                members.map((member) => {
                  const displayName = member.user_name || member.user_id;
                  const displayEmail = member.user_email || '';
                  const isAdmin = member.role === 'admin';

                  return (
                    <tr key={member.id} className="border-t border-border/60">
                      <td className="px-3 py-2 align-middle">
                        <div className="flex flex-col">
                          <span className="text-foreground text-sm font-medium">{displayName}</span>
                          <span className="text-xs text-muted-foreground">{displayEmail || 'No email on file'}</span>
                          <span className="text-xs text-muted-foreground">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs border',
                            isAdmin
                              ? 'bg-primary/10 text-primary border-primary/30'
                              : 'bg-muted text-muted-foreground border-border'
                          )}
                        >
                          {isAdmin ? 'Admin' : 'Member'}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => onToggleRole(member)} className="text-xs">
                            {isAdmin ? 'Make member' : 'Make admin'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveMember(member)}
                            className="text-xs text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
