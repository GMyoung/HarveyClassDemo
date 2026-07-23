import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSectionsContext } from "@/contexts/Sections";
import starWarsTrailer from "@/assets/trailers/star_wars_intro_30s.mp4?url";
import starWarsPoster from "@/assets/trailers/star_wars_poster.jpg?url";
import ninjagoTrailer from "@/assets/trailers/ninjago_intro_30s.mp4?url";
import ninjagoPoster from "@/assets/trailers/ninjago_poster.jpg?url";
import legoMovieTrailer from "@/assets/trailers/lego_movie_intro_30s.mp4?url";
import legoMoviePoster from "@/assets/trailers/lego_movie_poster.jpg?url";
import fortniteTrailer from "@/assets/trailers/fortnite_intro_30s.mp4?url";
import fortnitePoster from "@/assets/trailers/fortnite_poster.jpg?url";
import { DISMISS_STORY_TRAILER_EVENT, START_STORY_TRAILER_EVENT } from "./trailerEvents";
import "./TrailerIntro.css";

type TrailerConfig = {
  src: string;
  poster: string;
  eyebrow: string;
  title: string;
  source: string;
};

const trailerBySlide: Record<number, TrailerConfig> = {
  5: {
    src: starWarsTrailer,
    poster: starWarsPoster,
    eyebrow: "LICENSED WORLD · 1999",
    title: "LEGO Star Wars",
    source: "Official launch trailer · StarWars.com / Warner Bros. Games",
  },
  7: {
    src: ninjagoTrailer,
    poster: ninjagoPoster,
    eyebrow: "OWNED WORLD · 2011",
    title: "NINJAGO: Dragons Rising",
    source: "Official full trailer · The LEGO Group",
  },
  8: {
    src: legoMovieTrailer,
    poster: legoMoviePoster,
    eyebrow: "BRAND AS STORY · 2014",
    title: "The LEGO Movie",
    source: "Official main trailer · Warner Bros. Pictures",
  },
  9: {
    src: fortniteTrailer,
    poster: fortnitePoster,
    eyebrow: "PERSISTENT WORLD · 2023",
    title: "LEGO Fortnite",
    source: "Official cinematic trailer · LEGO Fortnite / Epic Games",
  },
};

export const TrailerIntro = () => {
  const { slideIndex } = useSectionsContext();
  const config = trailerBySlide[slideIndex];
  const nextConfig = trailerBySlide[slideIndex + 1];
  const [dismissedSlide, setDismissedSlide] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = Boolean(config && dismissedSlide !== slideIndex);
  const mediaConfig = isActive ? config : nextConfig ?? config;

  const dismiss = useCallback(() => {
    videoRef.current?.pause();
    setDismissedSlide(slideIndex);
  }, [slideIndex]);

  useEffect(() => {
    window.addEventListener(DISMISS_STORY_TRAILER_EVENT, dismiss);
    return () => window.removeEventListener(DISMISS_STORY_TRAILER_EVENT, dismiss);
  }, [dismiss]);

  useEffect(() => {
    const startWithSound = () => {
      const video = videoRef.current;
      if (!video) return;
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0;
      delete video.dataset.playbackError;
      void video.play().catch((error: unknown) => {
        video.dataset.playbackError = error instanceof Error ? error.message : String(error);
      });
    };

    window.addEventListener(START_STORY_TRAILER_EVENT, startWithSound);
    return () => window.removeEventListener(START_STORY_TRAILER_EVENT, startWithSound);
  }, []);

  useEffect(() => {
    if (!isActive || !config) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    void video.play().catch((error: unknown) => {
      video.dataset.playbackError = error instanceof Error ? error.message : String(error);
    });
  }, [config, isActive]);

  if (!mediaConfig) return null;

  return createPortal(
    <aside
      className={`story-trailer-intro${isActive ? "" : " story-trailer-intro--preload"}`}
      data-story-trailer-active={isActive ? "" : undefined}
      aria-hidden={!isActive}
      aria-label={`${mediaConfig.title} trailer intro`}
    >
      <video
        ref={videoRef}
        src={mediaConfig.src}
        poster={mediaConfig.poster}
        autoPlay={isActive}
        playsInline
        preload="auto"
        onCanPlay={(event) => {
          if (!isActive) return;
          event.currentTarget.muted = false;
          void event.currentTarget.play().catch(() => undefined);
        }}
        onEnded={dismiss}
      />
      <div className="story-trailer-intro__shade" aria-hidden="true" />
      <header className="story-trailer-intro__title">
        <span>{mediaConfig.eyebrow}</span>
        <h2>{mediaConfig.title}</h2>
        <small>{mediaConfig.source} · 30-second classroom excerpt · sound on</small>
      </header>
      <div className="story-trailer-intro__cue">
        <strong>TRAILER FIRST</strong>
        <span>Click / remote next to skip</span>
      </div>
      <i className="story-trailer-intro__timer" aria-hidden="true" />
    </aside>,
    document.body,
  );
};
