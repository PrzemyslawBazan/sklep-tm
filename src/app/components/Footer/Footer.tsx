import Image from "next/image";
import Link from "next/link";

import LogoSvg from '../../utils/LOGO.svg';
import Przelewy from '../../utils/flagi_Przelewy24_6.png';


export default function Footer() {
  return (
    <footer className="bg-custom-beige border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Content */}
        <div className="py-8">
          <div className="flex items-center gap-6">
            {/* Logo + Description */}
            <div className="max-w-[240px] flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={LogoSvg}
                  alt="Tax & Money Logo"
                  width={100}
                  height={42}
                  className="w-[90px] h-auto sm:w-[100px] object-contain"
                  priority
                />
              </Link>

              <p className="mt-4 text-sm leading-5 text-gray-600">
                Twoje zaufane biuro rachunkowe z Krakowa.
              </p>
            </div>

            <div className="flex items-center">
              <Image
                src={Przelewy}
                alt="Metody płatności"
                width={600}
                height={140}
                className="w-[350px] sm:w-[450px] lg:w-[550px] h-auto object-contain"
                priority
                />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300" />

        <div className="py-4 text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} Tax & Money. Wszystkie prawa
            zastrzeżone.
          </span>
        </div>
      </div>
    </footer>
  );
}