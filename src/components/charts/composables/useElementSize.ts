import { ref, onMounted, onUnmounted } from "vue";

export function useElementSize(elementRef: { value: HTMLElement | undefined }) {
  const width = ref(0);
  const height = ref(0);

  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    if (elementRef.value) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          width.value = entry.contentRect.width;
          height.value = entry.contentRect.height;
        }
      });

      resizeObserver.observe(elementRef.value);
    }
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  return {
    width,
    height,
  };
}
