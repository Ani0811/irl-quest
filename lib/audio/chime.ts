/**
 * Synthesizes a calming meditation bell chime using the native Web Audio API.
 * 100% offline, zero external audio asset dependencies.
 */
export function playQuestCompleteChime(): void {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // If context was suspended (browser autoplay policy), resume it
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonic frequencies for a soothing bell chime (528 Hz harmonic series)
    const tones = [
      { freq: 528, gain: 0.25, decay: 3.0 },
      { freq: 792, gain: 0.12, decay: 2.4 },
      { freq: 1056, gain: 0.06, decay: 1.8 },
    ];

    tones.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  } catch (err) {
    console.warn("[IRL Quest Audio] Web Audio chime could not play:", err);
  }
}
