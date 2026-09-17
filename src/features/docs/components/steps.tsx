type StepsProps = {
  children: React.ReactNode;
};

export function Steps({ children }: StepsProps) {
  return <div className="my-8 space-y-8 border-l pl-6">{children}</div>;
}

type StepProps = {
  title: string;
  children: React.ReactNode;
};

export function Step({ title, children }: StepProps) {
  return (
    <div className="relative">
      <div className="absolute -left-[39px] flex size-6 items-center justify-center rounded-full border bg-background text-xs font-semibold">
        •
      </div>

      <h3 className="mb-2 text-base font-semibold">{title}</h3>

      <div className="text-sm leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}
