import { Passport, Seal, sealToPassport } from "@/gear";
import { useEffect, useState } from "react";

export default function usePassport({ desk, seal }: { desk: string, seal: Seal }) {
  const [passport, setPassport] = useState<Passport | null>(null);

  const fetchPassport = async () => {
    const response = await sealToPassport(desk, seal);
    setPassport(response);
  };

  useEffect(() => {
    fetchPassport();
  }, []);

  return { passport };
}
