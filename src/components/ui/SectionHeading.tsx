export default function SectionHeading({
  title,
  align = "center",
}: {
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-text">{title}</h2>
      <span
        className={`mt-3 block h-[3px] w-14 rounded-full bg-brand-red ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
