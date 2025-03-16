interface ServiceMetricsProps {
  metrics?: string[];
  timeframe?: string;
}

export default function ServiceMetrics({ metrics, timeframe }: ServiceMetricsProps) {
  if ((!metrics || metrics.length === 0) && !timeframe) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Métricas de Sucesso</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeframe && (
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-[#d32b36]">Tempo de Implementação</h3>
                <p className="text-lg">{timeframe}</p>
              </div>
            )}
            
            {metrics && metrics.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 shadow-md md:col-span-2">
                <h3 className="text-xl font-semibold mb-3 text-[#d32b36]">Indicadores de Resultado</h3>
                <ul className="space-y-2">
                  {metrics.map((metric, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 text-[#d32b36]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
