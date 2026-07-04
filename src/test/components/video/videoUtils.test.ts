import { describe, it, expect } from "vitest";
import { getYoutubeEmbedUrl } from "@/components/video/videoUtils";

describe("getYoutubeEmbedUrl", () => {
  it("converts a standard youtube.com/watch URL", () => {
    expect(getYoutubeEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("converts a youtu.be short URL", () => {
    expect(getYoutubeEmbedUrl("https://youtu.be/abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("passes through an already-embedded URL", () => {
    expect(getYoutubeEmbedUrl("https://www.youtube.com/embed/abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("converts a YouTube Shorts URL", () => {
    expect(getYoutubeEmbedUrl("https://www.youtube.com/shorts/abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("converts a YouTube live URL", () => {
    expect(getYoutubeEmbedUrl("https://www.youtube.com/live/abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("handles the mobile m.youtube.com host", () => {
    expect(getYoutubeEmbedUrl("https://m.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("strips extra query params (timestamps, playlists) when extracting the video id", () => {
    expect(
      getYoutubeEmbedUrl("https://www.youtube.com/watch?v=abc123&t=42s&list=PL1"),
    ).toBe("https://www.youtube.com/embed/abc123");
  });

  it("returns null for a non-YouTube URL", () => {
    expect(getYoutubeEmbedUrl("https://example.com/video.mp4")).toBeNull();
  });

  it("returns null for a malformed URL, falling back to regex extraction when possible", () => {
    expect(getYoutubeEmbedUrl("not a url at all")).toBeNull();
  });

  it("recovers a video id via regex fallback from a non-standard-but-parseable string", () => {
    expect(getYoutubeEmbedUrl("check this out youtube.com/watch?v=abc123 nice")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });
});
