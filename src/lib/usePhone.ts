import { useEffect, useState } from "react";

/** Below this width the site switches to its phone layout. */
export const PHONE_BREAKPOINT = 768;

/** True while the viewport is phone-width. */
export function usePhone() {
  const [phone, setPhone] = useState(
    typeof window !== "undefined" && window.innerWidth < PHONE_BREAKPOINT
  );
  useEffect(() => {
    const onResize = () => setPhone(window.innerWidth < PHONE_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return phone;
}
