import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { QrCode, ScanQrCode } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { z } from 'zod';
import { ToolHeader } from '@/components/tool-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import type { RouteMeta } from '@/lib/siteTree';

const formSchema = z.object({
  data: z.string().min(1, 'Data is required'),
});

export const Route = createFileRoute('/tools/qr-code/simple')({
  component: Page,
});

export const routeMeta = {
  name: 'Wi-Fi QR Code Generator',
  description: 'Generate QR codes for easy Wi-Fi access on mobile devices',
} satisfies RouteMeta;

function Page() {
  const [generatedRecord, setGeneratedRecord] = useState<string>(
    'https://utils.tvk.lol',
  );
  const [contrastMode, setContrastMode] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: '',
    },
  });

  const handleChange = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit((data) => {
      setGeneratedRecord(data.data);
      toast.success('QR code generated!');
    })();
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="grow max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title={routeMeta.name}
        description={routeMeta.description}
        icon={QrCode}
      />

      <div className="flex flex-col gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanQrCode className="h-5 w-5 text-primary" />
              QR Code Data
            </CardTitle>
            <CardDescription>
              This data never leaves your browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onChange={handleChange} className="gap-6 flex flex-col">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://utils.tvk.lol"
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            inputRef.current = el;
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        The data to encode in the QR code, for example a URL or
                        text
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="mt-auto" type="submit">
                  Generate QR Code
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Generated QR Code</CardTitle>
              <CardDescription>
                Scan this QR code with your mobile device to access the data
              </CardDescription>
            </div>
            <Toggle pressed={contrastMode} onPressedChange={setContrastMode}>
              High Contrast
            </Toggle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`max-w-xs mx-auto p-2 ${contrastMode ? 'border border-dashed rounded-md bg-white p-4' : ''}`}
            >
              <QRCode
                className="h-auto max-w-full w-full"
                bgColor={contrastMode ? '#fff' : 'transparent'}
                fgColor={contrastMode ? '#000' : 'var(--accent-foreground)'}
                value={generatedRecord}
                viewBox={`0 0 256 256`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
