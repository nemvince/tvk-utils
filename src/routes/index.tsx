import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Page,
});

function Page() {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold">Welcome to TVK Utils</h1>
      <p>
        I'll make a landing page with recommendations and shit when I'm in the
        mood for that. :D
      </p>
    </div>
  );
}
