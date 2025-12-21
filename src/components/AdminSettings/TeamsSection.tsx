import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultTeamIcon, getTeamIcon, teamIconOptions } from '@/lib/teamIcons';
import type { Team } from '@/types/ticket';
import type { TeamIcon } from '@/types/team';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface TeamsSectionProps {
  teams: Team[];
  onCreateTeam: (name: string, icon?: TeamIcon) => Promise<void> | void;
  onUpdateTeam: (teamId: string, updates: { name?: string; icon?: TeamIcon }) => Promise<void> | void;
  onDeleteTeam: (teamId: string) => Promise<void> | void;
}

export function TeamsSection({ teams, onCreateTeam, onUpdateTeam, onDeleteTeam }: TeamsSectionProps) {
  const [teamName, setTeamName] = useState('');
  const [teamIcon, setTeamIcon] = useState<TeamIcon>(defaultTeamIcon);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingIcon, setEditingIcon] = useState<TeamIcon>(defaultTeamIcon);

  const resetNewTeamForm = () => {
    setTeamName('');
    setTeamIcon(defaultTeamIcon);
  };

  const startEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditingName(team.name);
    setEditingIcon(team.icon || defaultTeamIcon);
  };

  const cancelEdit = () => {
    setEditingTeamId(null);
    setEditingName('');
    setEditingIcon(defaultTeamIcon);
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;
    await onCreateTeam(teamName.trim(), teamIcon);
    resetNewTeamForm();
  };

  const handleSaveEdit = async (team: Team) => {
    await onUpdateTeam(team.id, { name: editingName || team.name, icon: editingIcon });
    cancelEdit();
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm">Teams</CardTitle>
        <div className="flex w-full items-center gap-2">
          <Label htmlFor="teamName" className="sr-only">
            Team name
          </Label>
          <Input
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
            className="h-9 w-full"
          />
          <Label htmlFor="teamIcon" className="sr-only">
            Team icon
          </Label>
          <Select value={teamIcon} onValueChange={(value) => setTeamIcon(value as TeamIcon)}>
            <SelectTrigger id="teamIcon" className="h-9 w-full flex items-center gap-2">
              <SelectValue placeholder="Icon" />
            </SelectTrigger>
            <SelectContent>
              {teamIconOptions.map(({ value, label, Icon }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-2" onClick={handleCreateTeam} disabled={!teamName.trim()}>
            <Plus className="w-4 h-4" />
            Add Team
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-64 overflow-y-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Name</th>
                <th className="text-left px-3 py-2 font-medium">Icon</th>
                <th className="text-right px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">
                    No teams yet.
                  </td>
                </tr>
              )}
              {teams.map((team) => {
                const isEditing = editingTeamId === team.id;
                const Icon = getTeamIcon(team.icon || defaultTeamIcon);
                const iconLabel = teamIconOptions.find((opt) => opt.value === team.icon)?.label || 'Icon';
                const hasNameChange = editingName.trim() && editingName.trim() !== team.name;
                const hasIconChange = editingIcon !== (team.icon || defaultTeamIcon);
                const disableSave = !editingName.trim() || (!hasNameChange && !hasIconChange);

                return (
                  <tr key={team.id} className="border-t border-border/60">
                    <td className="px-3 py-2 align-middle">
                      {isEditing ? (
                        <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="h-8" />
                      ) : (
                        <span className="text-foreground">{team.name}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      {isEditing ? (
                        <Select value={editingIcon} onValueChange={(value) => setEditingIcon(value as TeamIcon)}>
                          <SelectTrigger className="h-8 w-32 flex items-center gap-2">
                            <SelectValue placeholder="Icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamIconOptions.map(({ value, label, Icon }) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  <span>{label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{iconLabel}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 align-middle text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit(team)} disabled={disableSave}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(team)} title="Edit team">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteTeam(team.id)}
                            title="Delete team"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      )}
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
