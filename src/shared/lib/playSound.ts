export function playSound(src: string) {
  const audio = new Audio(src);
  audio.volume = 0.6;
  audio.play().catch(() => {
    // ignore autoplay / focus errors
  });
}
