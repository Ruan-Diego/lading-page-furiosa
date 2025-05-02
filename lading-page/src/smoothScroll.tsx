export function smoothScrollToElement(element: HTMLElement, duration = 1000) {
    const start = element.parentElement!.scrollTop;
    const end = element.offsetTop;
    const change = end - start;
    const startTime = performance.now();
  
    function animateScroll(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      element.parentElement!.scrollTop = start + change * easeInOutQuad(progress);
  
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }
  
    function easeInOutQuad(t: number) {
      return t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
    }
  
    requestAnimationFrame(animateScroll);
  }