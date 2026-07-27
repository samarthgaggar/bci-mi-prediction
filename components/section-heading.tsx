export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <header className="section-heading">
      <div className="section-heading__label">
        {index ? <span aria-hidden="true">{index}</span> : null}
        <p>{eyebrow}</p>
      </div>
      <div className="section-heading__copy">
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </header>
  );
}
