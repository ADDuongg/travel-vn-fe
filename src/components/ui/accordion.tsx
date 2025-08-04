import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
type AccordionTriggerProps = React.ComponentProps<
  typeof AccordionPrimitive.Trigger
> & {
  iconTrigger?: React.ReactElement<{ className?: string }>;
  iconOpen?: React.ReactElement<{ className?: string }>;
  iconClosed?: React.ReactElement<{ className?: string }>;
};
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  iconTrigger,
  iconOpen,
  iconClosed,
  ...props
}: AccordionTriggerProps) {
  const iconClassName =
    'text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200';
  const [isOpen, setIsOpen] = React.useState(false);
  const renderIcon = (
    icon: React.ReactElement<{ className?: string }> | undefined,
    extraClass: string,
  ) =>
    icon
      ? React.cloneElement(icon, {
          className: cn(iconClassName, icon.props.className, extraClass),
        })
      : null;

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        onClick={(e) => {
          console.log(123);
          setIsOpen((prev) => !prev);
        }}
        {...props}
      >
        {children}
        {/* Nếu có iconOpen/iconClosed thì dùng */}
        {iconOpen || iconClosed ? (
          isOpen ? (
            renderIcon(iconOpen, '')
          ) : (
            renderIcon(iconClosed, '')
          )
        ) : iconTrigger ? (
          React.cloneElement(iconTrigger, {
            className: cn(iconClassName, iconTrigger.props.className),
          })
        ) : (
          <ChevronDownIcon className={iconClassName} />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('p-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
