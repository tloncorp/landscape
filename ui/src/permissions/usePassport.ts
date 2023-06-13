import { Passport } from "@/gear";
import { useEffect, useState } from "react";
import { fakePassport } from './temp';

export default function usePassport() {
  const [passport, setPassport] = useState<Passport | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setPassport(fakePassport);
    } , 2000);
  }, []);

  return { passport };
}
