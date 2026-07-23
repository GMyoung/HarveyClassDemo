export const DISMISS_STORY_TRAILER_EVENT = "dismiss-story-trailer";
export const START_STORY_TRAILER_EVENT = "start-story-trailer";

const STORY_TRAILER_SLIDES = new Set([5, 7, 8, 9]);

export const hasStoryTrailer = (slideIndex: number) => STORY_TRAILER_SLIDES.has(slideIndex);
