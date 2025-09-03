import Image from "next/image";
import ContactBar from "./ContactBar";
import FooterMain from "./FooterMain";
import BottomBar from "./BottomBar";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#212529] pt-6 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0">
        <Image
          className="w-[8rem] md:w-[16rem]"
          src="/footerShape1_4 (1).png"
          alt="Decorative shape"
          width={512}
          height={512}
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <Image
          className="w-[8rem] md:w-[16rem]"
          src="/footerShape1_2 (1).png"
          alt="Decorative shape"
          width={512}
          height={512}
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <Image
          className="w-[8rem] md:w-[16rem]"
          src="/footerShape1_1.png"
          alt="Decorative shape"
          width={512}
          height={512}
        />
      </div>

      {/* Sections */}
      <ContactBar />
      <FooterMain />
      <BottomBar />
    </footer>
  );
}
