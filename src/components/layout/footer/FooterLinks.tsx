import Link from "next/link";

interface FooterLinksProps {
  title: string;
  links: { href: string; text: string }[];
}

export default function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div className="w-full md:w-1/4 flex flex-col gap-3">
      <div className="text-2xl font-extrabold">{title}</div>
      {links.map((link, idx) => (
        <Link key={idx} href={link.href} className="hover:text-[#eb0029]">
          {link.text}
        </Link>
      ))}
    </div>
  );
}
