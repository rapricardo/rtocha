interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "primary" | "secondary" | "accent";
}

export function ServiceCard({
  icon,
  title,
  description,
  color = "primary"
}: ServiceCardProps) {
  const colorClasses = {
    primary: "border-l-[#d32b36]",
    secondary: "border-l-[#d32b36]",
    accent: "border-l-[#d32b36]"
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${colorClasses[color]} transition-transform hover:translate-y-[-5px]`}>
      <div className="mb-4 text-[#d32b36]">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}