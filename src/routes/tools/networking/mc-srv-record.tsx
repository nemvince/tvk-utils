import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { Server, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { CopyButton, DownloadButton } from '@/components/gen-tools';
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
import type { RouteMeta } from '@/lib/siteTree';

const formSchema = z.object({
  baseDomain: z
    .string()
    .min(1, 'Base domain is required')
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/,
      'Please enter a valid domain (e.g., example.com)',
    ),
  subdomain: z
    .string()
    .refine(
      (val) => val === '' || /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*$/.test(val),
      {
        message: 'Subdomain can only contain letters, numbers, and hyphens',
      },
    )
    .optional(),
  port: z
    .number()
    .min(1, 'Port must be between 1 and 65535')
    .max(65535, 'Port must be between 1 and 65535'),
  priority: z
    .number()
    .min(0, 'Priority must be a non-negative number')
    .max(65535, 'Priority must be between 0 and 65535'),
  weight: z
    .number()
    .min(0, 'Weight must be a non-negative number')
    .max(65535, 'Weight must be between 0 and 65535'),
});

export const Route = createFileRoute('/tools/networking/mc-srv-record')({
  component: Page,
});

export const routeMeta = {
  name: 'Minecraft SRV Record Generator',
  description:
    'Generate DNS SRV records for your Minecraft server to use bare domain with custom ports',
} satisfies RouteMeta;

function Page() {
  const [generatedRecord, setGeneratedRecord] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseDomain: '',
      subdomain: '',
      port: 25565,
      priority: 10,
      weight: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const targetDomain =
      values.subdomain && values.subdomain.trim() !== ''
        ? `${values.subdomain}.${values.baseDomain}`
        : values.baseDomain;

    const recordName = `_minecraft._tcp.${targetDomain}`;

    const srvRecord = `${recordName} 600 IN SRV ${values.priority} ${values.weight} ${values.port} ${targetDomain}.`;

    setGeneratedRecord(srvRecord);
    toast.success('SRV record generated successfully!');
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
        icon={Server}
      />

      <div className="flex flex-col gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Server Configuration
            </CardTitle>
            <CardDescription>
              Enter your Minecraft server details to generate the SRV record
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="gap-6 grid lg:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="baseDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Domain *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example.com"
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            inputRef.current = el;
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Your main domain name (e.g., example.com)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subdomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subdomain</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormDescription>
                        The subdomain for your Minecraft server (e.g., mc, play,
                        server)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="25565"
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Your Minecraft server port (default: 25565)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Lower values = higher priority
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormDescription>Load balancing weight</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Generate SRV Record</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated SRV Record</CardTitle>
            <CardDescription>
              Copy this record to your DNS provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedRecord ? (
              <>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all flex justify-between items-center">
                  {generatedRecord}
                  <div className="space-x-2">
                    <DownloadButton
                      text={generatedRecord}
                      filename="minecraft-srv-record.txt"
                    />
                    <CopyButton text={generatedRecord} />
                  </div>
                </div>

                <Alert>
                  <AlertTitle>Summary</AlertTitle>
                  <AlertDescription className="inline">
                    Players can connect using{' '}
                    <code>{form.getValues('baseDomain')}</code>, which is the
                    same as connecting to{' '}
                    <code>
                      {form.getValues('subdomain')
                        ? `${form.getValues('subdomain')}.`
                        : ''}
                      {form.getValues('baseDomain')}:{form.getValues('port')}
                    </code>
                    . The SRV record will direct them to port{' '}
                    <code>{form.getValues('port')}</code> on your server.
                  </AlertDescription>
                </Alert>

                <Alert className="p-4 rounded-lg">
                  <AlertTitle>How to use:</AlertTitle>
                  <AlertDescription>
                    <ol className="text-sm space-y-1 list-decimal list-inside text-gray-700 dark:text-gray-300">
                      <li>Copy/Download the generated SRV record above</li>
                      <li>Go to your DNS provider's control panel</li>
                      <li>
                        Make sure you have an A record set up for the same
                        subdomain with your server's IP address
                      </li>
                      <li>
                        Add a new SRV record with the generated value or import
                        the downloaded file if your provider supports it
                      </li>
                      <li>Wait for DNS propagation (usually 5-30 minutes)</li>
                      <li>Players can now connect using your custom domain!</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill out the form to generate your SRV record</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
