"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoginDialog from "../components/layout/LoginDialogBox";

export default function LoginModalWrapper() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [status]);

  return <LoginDialog open={open} onClose={() => setOpen(false)} />;
}
