interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export default function ContactItem({ icon, title, text }: ContactItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          {icon}
        </div>
        {title}
      </div>
      <span>{text}</span>
    </div>
  );
}
