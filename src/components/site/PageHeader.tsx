export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="px-6 pt-36 pb-12">
      <div className="reveal mx-auto max-w-7xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    </section>
  );
}
