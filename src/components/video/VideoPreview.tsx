import { forwardRef, Ref, useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";
import { getYoutubeEmbedUrl } from "./videoUtils";

type VideoPreviewProps = {
  url?: string;
  file?: File | null;
  title?: string;
  className?: string;
  controlsList?: string;
  iframeRef?: Ref<HTMLIFrameElement>;
  onEnded?: () => void;
  poster?: string;
  autoLoad?: boolean;
};

const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  (
    { url = "", file = null, title, className, controlsList, iframeRef, onEnded, poster, autoLoad = false },
    ref,
  ) => {
    const [objectUrl, setObjectUrl] = useState("");
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(autoLoad);

    useEffect(() => {
      if (!file) {
        setObjectUrl("");
        return;
      }

      const nextUrl = URL.createObjectURL(file);
      setObjectUrl(nextUrl);
      return () => URL.revokeObjectURL(nextUrl);
    }, [file]);

    const source = objectUrl || url.trim();
    const embedUrl = useMemo(() => (source ? getYoutubeEmbedUrl(source) : null), [source]);

    useEffect(() => {
      setFailed(false);
      // An uploaded file (blob) or a fresh source should always start unloaded again.
      setLoaded(autoLoad);
    }, [source, autoLoad]);

    if (!source) return null;

    const resolvedClassName = className || "w-full rounded-lg aspect-video bg-black";

    if (!loaded) {
      return (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className={`${resolvedClassName} relative group overflow-hidden bg-black flex items-center justify-center`}
          aria-label={`Play ${title || "video"}`}
        >
          {poster && (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
            />
          )}
          <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#151517]/90 group-hover:bg-[#151517] transition-colors">
            <Play className="h-7 w-7 text-white fill-black translate-x-0.5" />
          </span>
        </button>
      );
    }

    if (embedUrl) {
      return (
        <iframe
          ref={iframeRef}
          src={`${embedUrl}?enablejsapi=1&autoplay=1`}
          title={title || "Video preview"}
          className={className || "w-full rounded-lg aspect-video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <div className="space-y-2">
        <video
          ref={ref}
          key={source}
          src={source}
          className={resolvedClassName}
          controls
          autoPlay
          controlsList={controlsList}
          onError={() => setFailed(true)}
          onEnded={onEnded}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
        {failed && (
          <p className="text-xs text-destructive">
            This video could not be loaded in the browser.{" "}
            <a href={source} target="_blank" rel="noreferrer" className="underline">
              Open the file directly
            </a>
            .
          </p>
        )}
      </div>
    );
  },
);

VideoPreview.displayName = "VideoPreview";

export default VideoPreview;
