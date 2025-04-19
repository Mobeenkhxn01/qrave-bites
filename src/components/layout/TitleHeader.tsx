import Link from "next/link";

type TitleHeaderProps = {
  title: string;
  subtitle: string;
};

export default function TitleHeader({ title, subtitle }: TitleHeaderProps) {
  return (
    <div
      className="p-4 bg-cover bg-center shadow-sm"
      style={{ backgroundImage: 'url("/breadcumb.jpg")', objectFit: "fill" }}
    >
      <div className="w-full flex justify-center items-center flex-col bg-opacity-70 p-36 gap-8">
        <h1 className="uppercase font-roboto text-6xl font-extrabold text-white">
          {title}
        </h1>
        <Link href={"/"}>
          <h1 className="text-[#eb0029]">
            <span className="text-white">Home {" / "}</span>
            {subtitle}
          </h1>
        </Link>
      </div>
    </div>
  );
}
