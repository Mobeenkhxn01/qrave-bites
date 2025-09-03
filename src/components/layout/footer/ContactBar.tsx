import { IoLocationSharp } from "react-icons/io5";
import { MailIcon, PhoneCallIcon } from "lucide-react";
import ContactItem from "./ContactItem";

export default function ContactBar() {
  return (
    <div className="relative z-10 w-10/12 mx-auto flex flex-col md:flex-row justify-between rounded-2xl items-start md:items-center text-white p-6 bg-[#fc791a] font-bold">
      <ContactItem
        icon={<IoLocationSharp className="w-6 h-6 text-[#eb0029]" />}
        title="Address"
        text="Kharar Mohali, Punjab, 140413"
      />
      <ContactItem
        icon={<MailIcon className="w-6 h-6 text-[#eb0029]" />}
        title="Email"
        text="qravebites@gmail.com"
      />
      <ContactItem
        icon={<PhoneCallIcon className="w-6 h-6 text-[#eb0029]" />}
        title="Contact"
        text="+91 6303660509"
      />
    </div>
  );
}
