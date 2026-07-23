import foreverUrl from "@/assets/forever.mp3?url";

const FALLBACK_DURATION_SECONDS = 143.161;
const previewTime = (() => {
  if (window.location.hostname !== "127.0.0.1" && window.location.hostname !== "localhost") return null;
  const value = Number(new URLSearchParams(window.location.search).get("finalePreview"));
  return Number.isFinite(value) && value >= 0 ? value : null;
})();

let finaleAudio: HTMLAudioElement | null = null;
let volumeFrame = 0;
let playbackError = "";

const getAudio = () => {
  if (finaleAudio) return finaleAudio;

  finaleAudio = new Audio(foreverUrl);
  finaleAudio.preload = "auto";
  finaleAudio.volume = 0.78;
  finaleAudio.dataset.finaleAudio = "forever";
  finaleAudio.style.display = "none";
  finaleAudio.addEventListener("error", () => {
    playbackError = finaleAudio?.error
      ? `Media error ${finaleAudio.error.code}: ${finaleAudio.error.message}`
      : "Unknown media error";
  });
  document.body.append(finaleAudio);
  return finaleAudio;
};

const cancelVolumeAnimation = () => {
  if (volumeFrame) window.cancelAnimationFrame(volumeFrame);
  volumeFrame = 0;
};

export const prepareFinaleAudio = () => {
  const audio = getAudio();
  if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) audio.load();
};

export const startFinaleAudio = async () => {
  const audio = getAudio();
  playbackError = "";
  delete audio.dataset.playbackError;
  cancelVolumeAnimation();
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 0;

  try {
    await audio.play();
  } catch (error) {
    playbackError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    audio.dataset.playbackError = playbackError;
    audio.volume = 0.78;
    return false;
  }

  const fadeStartedAt = performance.now();
  const fadeIn = (now: number) => {
    const alpha = Math.min(1, (now - fadeStartedAt) / 1800);
    audio.volume = 0.78 * alpha;
    if (alpha < 1) volumeFrame = window.requestAnimationFrame(fadeIn);
    else volumeFrame = 0;
  };
  volumeFrame = window.requestAnimationFrame(fadeIn);
  return true;
};

export const stopFinaleAudio = (reset = true) => {
  cancelVolumeAnimation();
  if (!finaleAudio) return;
  finaleAudio.pause();
  finaleAudio.volume = 0.78;
  if (reset) finaleAudio.currentTime = 0;
};

export const getFinalePlayback = () => {
  const audio = getAudio();
  const duration = Number.isFinite(audio.duration) && audio.duration > 0
    ? audio.duration
    : FALLBACK_DURATION_SECONDS;
  const currentTime = previewTime === null
    ? Number.isFinite(audio.currentTime) ? audio.currentTime : 0
    : Math.min(duration, previewTime);
  const isPreview = previewTime !== null;

  return {
    currentTime,
    duration,
    progress: Math.min(1, currentTime / duration),
    isPlaying: isPreview || (!audio.paused && !audio.ended),
    hasStarted: isPreview || currentTime > 0 || !audio.paused,
    hasEnded: currentTime >= duration - 0.15 || (!isPreview && audio.ended),
    readyState: audio.readyState,
    error: playbackError,
  };
};

export const hasFinaleEnded = () => getFinalePlayback().hasEnded;
