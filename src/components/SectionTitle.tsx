interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  centered = false
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      {subtitle && (
        <p className="text-xl text-gray-600">{subtitle}</p>
      )}
      <div className={`h-1 w-20 bg-[#d32b36] mt-4 ${centered ? "mx-auto" : ""}`}></div>
    </div>
  );
}