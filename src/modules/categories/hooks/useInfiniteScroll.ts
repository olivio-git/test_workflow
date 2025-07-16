import { useCallback, useEffect } from "react";

export function useInfiniteScroll({
  containerRef,
  callback,
  disabled = false,
}: {
  containerRef: React.RefObject<HTMLElement>;
  callback: () => void;
  disabled?: boolean;
}) {
  const onScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    if (container.scrollHeight - container.scrollTop <= container.clientHeight + 100) {
      callback();
    }
  }, [callback, disabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [onScroll]);
}