import { urlForImage } from "@/lib/sanity/image";

interface ServiceHeaderProps {
  name: string;
  shortDescription: string;
  marketingTitle?: string;
  marketingDescription?: string;
  image?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
}

export default function ServiceHeader({ name, shortDescription, marketingTitle, marketingDescription, image }: ServiceHeaderProps) {
  return (
    <section className="bg-gradient-to-r from-[#d32b36] to-[#e67a48] text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{marketingTitle || name}</h1>
          <p className="text-xl md:text-2xl leading-relaxed opacity-90">{marketingDescription || shortDescription}</p>
          <div className="mt-8">
            <a 
              href="#agendar-consultoria" 
              className="inline-block bg-white text-[#d32b36] font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Agendar Consultoria
            </a>
          </div>
        </div>
        {image && (
          <div className="md:w-1/2 flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-2xl w-full max-w-lg">
              <img 
                src={urlForImage(image).width(800).height(600).url()} 
                alt={name}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
