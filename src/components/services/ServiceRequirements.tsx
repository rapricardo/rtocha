interface ServiceRequirementsProps {
  requirements?: string[];
}

export default function ServiceRequirements({ requirements }: ServiceRequirementsProps) {
  if (!requirements || requirements.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Requisitos</h2>
          
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Para implementar este serviço, você precisará de:</h3>
            <ul className="space-y-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-4 mt-1 text-[#d32b36]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
