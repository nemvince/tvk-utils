import { createFileRoute } from '@tanstack/react-router';
import { Link2, Link2Off } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CopyButton, DownloadButton } from '@/components/gen-tools';
import { ToolHeader } from '@/components/tool-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { RouteMeta } from '@/lib/siteTree';

export const Route = createFileRoute('/tools/text/url-encode-decode')({
  component: Page,
});

export const routeMeta = {
  name: 'URL Encode / Decode',
  description:
    'Encode text for safe use in URLs or decode percent-encoded strings. Supports full encodeURI/encodeURIComponent modes and plus-to-space.',
} satisfies RouteMeta;

type FormValues = {
  input: string;
  mode: 'component' | 'uri';
  plusAsSpace: boolean;
};

function safeEncode(value: string, mode: 'component' | 'uri') {
  try {
    return mode === 'component' ? encodeURIComponent(value) : encodeURI(value);
  } catch {
    return '';
  }
}

function safeDecode(value: string, mode: 'component' | 'uri', plusAsSpace: boolean) {
  try {
    const v = plusAsSpace ? value.replace(/\+/g, ' ') : value;
    return mode === 'component' ? decodeURIComponent(v) : decodeURI(v);
  } catch {
    return '';
  }
}

function Page() {
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');

  const form = useForm<FormValues>({
    defaultValues: {
      input: '',
      mode: 'component',
      plusAsSpace: false,
    },
  });

  const input = form.watch('input');
  const mode = form.watch('mode');
  const plusAsSpace = form.watch('plusAsSpace');

  const update = useMemo(() => {
    return () => {
      setEncoded(safeEncode(input, mode));
      setDecoded(safeDecode(input, mode, plusAsSpace));
    };
  }, [input, mode, plusAsSpace]);

  useEffect(() => {
    update();
  }, [update]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  const swap = () => {
    // move encoded to input to decode or vice versa depending on current panel focus
    form.setValue('input', encoded);
  };

  return (
    <div className="grow max-w-4xl mx-auto space-y-6">
      <ToolHeader title={routeMeta.name} description={routeMeta.description} icon={Link2} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Input & Options
            </CardTitle>
            <CardDescription>Type or paste text. Encoding updates live.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form className="space-y-4" onChange={() => update()}>
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Hello world! a=b&c=d? e/ф"
                          className="h-36"
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            inputRef.current = el;
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-rows-2 gap-3">
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode</FormLabel>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={field.value === 'component' ? 'default' : 'outline'}
                            onClick={() => field.onChange('component')}
                          >
                            encodeURIComponent
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'uri' ? 'default' : 'outline'}
                            onClick={() => field.onChange('uri')}
                          >
                            encodeURI
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plusAsSpace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decode Options</FormLabel>
                        <div className="flex items-center gap-2">
                          <Checkbox id="plusAsSpace" checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                          <Label htmlFor="plusAsSpace">Treat "+" as space on decode</Label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="button" variant="outline" onClick={swap} title="Move encoded to input">
              Use encoded as input
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Encoded</CardTitle>
              <CardDescription>Percent-encoded output</CardDescription>
            </CardHeader>
            <CardContent>
              <Input readOnly value={encoded} placeholder="Encoded result" />
              <div className="flex gap-2 mt-2">
                <CopyButton text={encoded} />
                <DownloadButton text={encoded} filename="encoded.txt" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2Off className="h-5 w-5 text-primary" />
                Decoded (try pasting an encoded string into input)
              </CardTitle>
              <CardDescription>Decoding applies selected options</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea readOnly value={decoded} className="h-36" placeholder="Decoded result" />
              <div className="flex gap-2 mt-2">
                <CopyButton text={decoded} />
                <DownloadButton text={decoded} filename="decoded.txt" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
