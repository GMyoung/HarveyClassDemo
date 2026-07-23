import { useEffect, useRef, type CSSProperties } from "react";

type MediaCredit = {
  label: string;
  year?: string;
};

type StoryVideoProps = {
  src: string;
  poster: string;
  alt: string;
  credit: MediaCredit;
  startAt?: number;
  endAt?: number;
};

type StorySlideshowProps = {
  images: { src: string; alt: string }[];
  credit: MediaCredit;
};

type StoryImageProps = {
  src: string;
  alt: string;
  credit: MediaCredit;
  contain?: boolean;
};

const MediaCaption = ({ credit }: { credit: MediaCredit }) => (
  <figcaption className="story-media__credit">
    <span>IMAGE / VIDEO</span>
    {credit.label}{credit.year ? ` · ${credit.year}` : ""}
  </figcaption>
);

export const StoryVideo = ({
  src,
  poster,
  alt,
  credit,
  startAt = 0,
  endAt,
}: StoryVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const start = () => {
      if (Math.abs(video.currentTime - startAt) > 0.5) video.currentTime = startAt;
      void video.play().catch(() => undefined);
    };

    const loopSegment = () => {
      if (endAt !== undefined && video.currentTime >= endAt) {
        video.currentTime = startAt;
        void video.play().catch(() => undefined);
      }
    };

    video.addEventListener("loadedmetadata", start);
    video.addEventListener("timeupdate", loopSegment);
    if (video.readyState >= 1) start();

    return () => {
      video.pause();
      video.removeEventListener("loadedmetadata", start);
      video.removeEventListener("timeupdate", loopSegment);
    };
  }, [endAt, startAt]);

  return (
    <figure className="story-media story-media--video">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={alt}
        autoPlay
        muted
        playsInline
        preload="metadata"
        loop={endAt === undefined}
      />
      <span className="story-media__motion-label" aria-hidden="true">OFFICIAL FOOTAGE · MUTED</span>
      <MediaCaption credit={credit} />
    </figure>
  );
};

export const StorySlideshow = ({ images, credit }: StorySlideshowProps) => (
  <figure className="story-media story-media--slideshow">
    <div className="story-media__frames">
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={index === 0 ? image.alt : ""}
          aria-hidden={index !== 0}
          style={{
            "--frame-index": index,
            "--frame-count": images.length,
          } as CSSProperties}
        />
      ))}
    </div>
    <span className="story-media__motion-label" aria-hidden="true">DIGITAL WORLD · LIVE LOOP</span>
    <MediaCaption credit={credit} />
  </figure>
);

export const StoryImage = ({ src, alt, credit, contain = false }: StoryImageProps) => (
  <figure className={`story-media story-media--image${contain ? " story-media--contain" : ""}`}>
    <img src={src} alt={alt} />
    <MediaCaption credit={credit} />
  </figure>
);
