import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/Button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/images/logo-ricardotocha-vermelho.webp"
              alt="Ricardo Tocha Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="/#sobre" className="font-medium text-gray-700 hover:text-[#d32b36]">Sobre</Link>
          <Link href="/#servicos" className="font-medium text-gray-700 hover:text-[#d32b36]">Serviços</Link>
          <Link href="/#cta-section" className="font-medium text-gray-700 hover:text-[#d32b36]">Contato</Link>
        </nav>
        <div className="hidden md:block">
          <Button 
            href="https://wa.me/5519991924835?text=Tocha%2C%20me%20ajuda%20a%20vender%20mais" 
            size="sm" 
            variant="primary"
            target="_blank"
          >
            Fale Comigo
          </Button>
        </div>
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}