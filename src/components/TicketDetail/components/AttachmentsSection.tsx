import { Image as ImageIcon, FileText, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Attachment } from '@/types/ticket';
import { useRef, ChangeEventHandler } from 'react';
import { Button } from '@/components/ui/button';

interface AttachmentsSectionProps {
  attachments: Attachment[];
  loading: boolean;
  uploading: boolean;
  onUpload: (file: File) => Promise<void> | void;
}

const isImage = (contentType: string) => contentType.startsWith('image/');

export function AttachmentsSection({ attachments, loading, uploading, onUpload }: AttachmentsSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(file);
    e.target.value = '';
  };

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">Attachments</h3>
          <p className="text-xs text-muted-foreground">Images (.png, .jpg) and text/log files</p>
        </div>
        <div className="flex items-center gap-2">
          {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          <Button variant="outline" size="sm" className="gap-2" onClick={handleClick} disabled={uploading}>
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,text/plain,.log"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading attachments...</p>
      ) : attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attachments yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {attachments.map((attachment) => {
            const icon = isImage(attachment.contentType) ? ImageIcon : FileText;
            const Icon = icon;
            return (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg border border-border hover:border-primary/50 hover:text-foreground transition-colors"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{attachment.filename}</p>
                  <p className="text-xs text-muted-foreground truncate">{attachment.contentType}</p>
                </div>
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
