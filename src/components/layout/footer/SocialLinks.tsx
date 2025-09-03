import Link from "next/link";

interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function SocialLink({ href, children }: SocialLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-[#eb0029] p-2 border border-white transition-colors"
    >
      {children}
    </Link>
  );
}
