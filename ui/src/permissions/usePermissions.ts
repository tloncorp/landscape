import { getAppName } from "@/logic/utils";
import { useCharge, useTreaty, useRemoteDesk, useInstallStatus } from "@/state/docket";
import { usePike } from "@/state/kiln";
import { useParams } from "react-router-dom";
import usePassport from "./usePassport";

export default function usePermissions() {
  const { host, desk } = useParams<{ desk: string, host: string }>();
  const charge = useCharge(desk);
  const pike = usePike(desk);
  const treaty = useTreaty(host, desk);
  const docket = charge || treaty;
  const appName = getAppName(docket);
  const { passport } = usePassport(); // TODO: pass in desk
  const [ship,] = useRemoteDesk(docket, pike, treaty?.ship);
  const installStatus = useInstallStatus(docket);

  return {
    appName,
    charge,
    desk,
    docket,
    host,
    installStatus,
    passport,
    pike,
    ship,
    treaty,
  }
}
