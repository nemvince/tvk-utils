import { Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={copyToClipboard}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}

interface DownloadButtonProps {
  text: string;
  filename: string;
  className?: string;
}

export function DownloadButton({
  text,
  filename,
  className,
}: DownloadButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const downloadFile = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={downloadFile}
    >
      {downloaded ? <Check /> : <Download />}
    </Button>
  );
}
