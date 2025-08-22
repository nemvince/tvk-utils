import { createFileRoute } from '@tanstack/react-router';
import { AlertCircleIcon, EthernetPort, Network } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ToolHeader } from '@/components/tool-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { RouteMeta } from '@/lib/siteTree';

const CIDR_PART = '(?:\\d{1,3}(?:\\.\\d{1,3}){3}\\/(?:\\d|[12]\\d|3[0-2]))';
const LINE_PATTERN = new RegExp(`^${CIDR_PART}(?:, ?${CIDR_PART})*$`);

type CidrBlock = {
  cidr: string;
  start: number;
  end: number;
};

type InvalidLine = {
  lineNumber: number;
  content: string;
  reason: string;
};

const ipToInt = (ip: string) => {
  return (
    ip
      .split('.')
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
};

const intToIp = (int: number) => {
  return [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8) & 0xff,
    int & 0xff,
  ].join('.');
};

const isValidIpv4 = (ip: string) => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  for (const p of parts) {
    if (p.length === 0 || p.length > 3) return false;
    if (!/^\d{1,3}$/.test(p)) return false;
    const n = Number(p);
    if (Number.isNaN(n) || n < 0 || n > 255) return false;
  }
  return true;
};

const tryParseCidr = (cidr: string): CidrBlock | null => {
  const [ip, prefixStr] = cidr.split('/');
  const prefix = Number(prefixStr);
  if (!isValidIpv4(ip) || Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
    return null;
  }
  const ipInt = ipToInt(ip);
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const network = ipInt & mask;
  const broadcast = network | (~mask >>> 0);
  return { cidr, start: network >>> 0, end: broadcast >>> 0 };
};

const findOverlaps = (
  blocks: CidrBlock[],
): { a: CidrBlock; b: CidrBlock }[] => {
  const overlaps: { a: CidrBlock; b: CidrBlock }[] = [];

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i];
      const b = blocks[j];

      if (a.start <= b.end && b.start <= a.end) {
        overlaps.push({ a, b });
      }
    }
  }

  return overlaps;
};

export const Route = createFileRoute('/tools/networking/cidr-clash')({
  component: Page,
});

export const routeMeta = {
  name: 'CIDR Overlap Checker',
  description: 'Check for overlapping CIDR blocks to avoid network conflicts',
} satisfies RouteMeta;

function Page() {
  const [input, setInput] = useState<string>('');
  const [validCidrs, setValidCidrs] = useState<string[]>([]);
  const [parsedBlocks, setParsedBlocks] = useState<CidrBlock[]>([]);
  const [overlaps, setOverlaps] = useState<{ a: CidrBlock; b: CidrBlock }[]>(
    [],
  );
  const [invalidLines, setInvalidLines] = useState<InvalidLine[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const lines = input.split(/\r?\n/);
    const newInvalid: InvalidLine[] = [];
    const collectedCidrs: string[] = [];

    lines.forEach((raw, idx) => {
      const lineNumber = idx + 1;
      const line = raw.trim();
      if (line === '') return;

      if (!LINE_PATTERN.test(line)) {
        newInvalid.push({
          lineNumber,
          content: raw,
          reason:
            'Invalid format. Use comma-separated CIDRs with optional single space after commas.',
        });
        return;
      }

      const tokens = line.split(/, ?/);
      let allValid = true;
      for (const t of tokens) {
        const [ip, prefixStr] = t.split('/');
        const prefix = Number(prefixStr);
        if (
          !isValidIpv4(ip) ||
          Number.isNaN(prefix) ||
          prefix < 0 ||
          prefix > 32
        ) {
          allValid = false;
          break;
        }
      }
      if (!allValid) {
        newInvalid.push({
          lineNumber,
          content: raw,
          reason: 'One or more CIDRs on this line are invalid.',
        });
        return;
      }

      collectedCidrs.push(...tokens);
    });

    setInvalidLines(newInvalid);
    setValidCidrs(collectedCidrs);

    const parsed = collectedCidrs
      .map(tryParseCidr)
      .filter((b): b is CidrBlock => b !== null);

    const seen = new Set<string>();
    const blocks: CidrBlock[] = [];
    for (const b of parsed) {
      if (!seen.has(b.cidr)) {
        seen.add(b.cidr);
        blocks.push(b);
      }
    }

    setParsedBlocks(blocks);
    setOverlaps(findOverlaps(blocks));
  }, [input]);

  const parsedRangesText = useMemo(
    () =>
      parsedBlocks
        .map((b) => `${intToIp(b.start)}/${b.cidr.split('/')[1]}`)
        .join('\n'),
    [parsedBlocks],
  );

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="grow max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title={routeMeta.name}
        description={routeMeta.description}
        icon={Network}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EthernetPort className="h-5 w-5 text-primary" />
            Overlap Checker
          </CardTitle>
          <CardDescription>
            Enter lines of comma-separated CIDRs. <br />
            Allowed separators: comma, comma + space, newline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cidr-input">Input</Label>
              <Textarea
                id="cidr-input"
                className="h-36 md:min-w-sm"
                value={input}
                ref={inputRef}
                onChange={handleInputChange}
                placeholder="10.0.0.0/8,192.168.0.0/16
172.16.0.0/12, 100.64.0.0/10,10.0.0.0/24, 172.16.0.1/32"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="parsed-ranges">Parsed ranges</Label>
              <Textarea
                id="parsed-ranges"
                className="h-36 md:min-w-sm"
                value={parsedRangesText}
                readOnly
                placeholder="Parsed ranges will appear here..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Overlaps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {invalidLines.length > 0 && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Invalid lines detected</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1">
                  {invalidLines.map((l) => (
                    <li key={l.lineNumber}>
                      Line {l.lineNumber}: "{l.content}" — {l.reason}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-4">
            {validCidrs.length === 0 ? (
              <p className="text-accent-foreground text-center">
                Enter CIDRs to begin.
              </p>
            ) : overlaps.length === 0 ? (
              <p className="text-accent-foreground text-center">
                No overlaps found.
              </p>
            ) : (
              overlaps.map(({ a, b }) => (
                <Alert key={a.cidr + b.cidr + a.start + b.start}>
                  <AlertCircleIcon className="text-red-500!" />
                  <AlertTitle>
                    {a.cidr} overlaps with {b.cidr}
                  </AlertTitle>
                  <AlertDescription>
                    {intToIp(a.start) === intToIp(a.end)
                      ? intToIp(a.start)
                      : `${intToIp(a.start)} - ${intToIp(a.end)}`}{' '}
                    overlaps with{' '}
                    {intToIp(b.start) === intToIp(b.end)
                      ? intToIp(b.start)
                      : `${intToIp(b.start)} - ${intToIp(b.end)}`}
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
