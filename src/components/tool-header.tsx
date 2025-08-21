import type { ElementType } from 'react';

type ToolHeaderProps = {
  icon?: ElementType;
  title?: string;
  description?: string;
};

export function ToolHeader({
  icon: Icon,
  title,
  description,
}: ToolHeaderProps) {
  return (
    <div className="text-center space-y-4 pt-8">
      <div className="flex items-center justify-center gap-3">
        <div className="p-3 bg-primary rounded-xl">
          {Icon ? <Icon className="h-8 w-8 text-white" /> : null}
        </div>
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
