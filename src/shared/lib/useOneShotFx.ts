/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';

type Options = {
  durationMs: number;
};

export function useOneShotFx(fireWhen: boolean, { durationMs }: Options) {
  const firedRef = useRef(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // transition: false -> true
    if (!firedRef.current && fireWhen) {
      firedRef.current = true;
      setShow(true);

      const t = window.setTimeout(() => {
        setShow(false);
      }, durationMs);

      return () => window.clearTimeout(t);
    }

    // reset gate if condition goes false again
    if (!fireWhen) {
      firedRef.current = false;
    }
  }, [fireWhen, durationMs]);

  return show;
}
