import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { Server, Wifi, WifiCog } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { z } from 'zod';
import { ToolHeader } from '@/components/tool-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import type { RouteMeta } from '@/lib/siteTree';

const formSchema = z
  .object({
    ssid: z.string().min(1, 'SSID is required'),
    encryption: z.enum(['WPA', 'WEP', 'nopass']),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.encryption === 'WPA') {
      if (!data.password) {
        ctx.addIssue({
          path: ['password'],
          code: 'custom',
          message: 'Password is required for WPA/WPA2 networks',
        });
      } else if (data.password.length < 8 || data.password.length > 63) {
        ctx.addIssue({
          path: ['password'],
          code: 'custom',
          message: 'WPA/WPA2 password must be 8-63 characters',
        });
      }
    } else if (data.encryption === 'WEP') {
      if (!data.password) {
        ctx.addIssue({
          path: ['password'],
          code: 'custom',
          message: 'Password is required for WEP networks',
        });
      } else if (data.password.length !== 5 && data.password.length !== 13) {
        ctx.addIssue({
          path: ['password'],
          code: 'custom',
          message: 'WEP password must be exactly 5 or 13 characters',
        });
      }
    } else if (data.encryption === 'nopass') {
      if (data.password) {
        ctx.addIssue({
          path: ['password'],
          code: 'custom',
          message: 'Password should be empty for open networks',
        });
      }
    }
  });

export const Route = createFileRoute('/tools/qr-code/wifi')({
  component: Page,
});

export const routeMeta = {
  name: 'Wi-Fi QR Code Generator',
  description: 'Generate QR codes for easy Wi-Fi access on mobile devices',
} satisfies RouteMeta;

function Page() {
  const [generatedRecord, setGeneratedRecord] = useState<string>('');
  const [contrastMode, setContrastMode] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ssid: '',
      encryption: 'WPA',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { ssid, encryption, password } = values;
    let record = `WIFI:T:${encryption};S:${ssid};`;
    if (encryption !== 'nopass') {
      record += `P:${password};`;
    }
    record += ';';
    setGeneratedRecord(record);
    toast.success('QR code generated successfully!');
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="grow max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title={routeMeta.name}
        description={routeMeta.description}
        icon={Wifi}
      />

      <div className="flex flex-col gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiCog className="h-5 w-5 text-primary" />
              Wi-Fi Details
            </CardTitle>
            <CardDescription>
              This data never leaves your browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="gap-6 flex flex-col"
              >
                <FormField
                  control={form.control}
                  name="ssid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="HomeWifi"
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            inputRef.current = el;
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        The SSID (name) of your Wi-Fi network
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Wi-Fi password (leave blank for open networks)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="encryption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Encryption</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select encryption" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">None (Open)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        The encryption type of your Wi-Fi network, if unsure
                        select WPA if your network is password protected,
                        otherwise select None (Open)
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
                Scan this QR code with your mobile device to connect to the
                Wi-Fi network
              </CardDescription>
            </div>
            <Toggle pressed={contrastMode} onPressedChange={setContrastMode}>
              High Contrast
            </Toggle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedRecord ? (
              <>
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

                <Alert className="p-4 rounded-lg">
                  <AlertTitle>How to use:</AlertTitle>
                  <AlertDescription>
                    Open your phone&apos;s camera app and point it at the QR
                    code. A notification should appear prompting you to join the
                    Wi-Fi network. Tap the notification to connect.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill out the form to generate your QR code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
