import { useEffect, useState } from "react";

const MINUTE = 60_000;

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNextTick = () => {
      timeout = setTimeout(
        () => {
          setNow(new Date());
          scheduleNextTick();
        },
        MINUTE - (Date.now() % MINUTE),
      );
    };

    scheduleNextTick();
    return () => clearTimeout(timeout);
  }, []);

  return now;
}
