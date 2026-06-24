import { forwardRef, Ref, useEffect, useMemo, useState } from "react";
import { getYoutubeEmbedUrl } from "./videoUtils";

type VideoPreviewProps = {
  url?: string;
  file?: File | null;
  title?: string;
  className?: string;
  controlsList?: string;
  iframeRef?: Ref<HTMLIFrameElement>;
};

const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ url = "", file = null, title, className, controlsList, iframeRef }, ref) => {
    const [objectUrl, setObjectUrl] = useState("");
    const [failed, setFailed] = useState(false);

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
    }, [source]);

    if (!source) return null;

    if (embedUrl) {
      return (
        <iframe
          ref={iframeRef}
          src={`${embedUrl}?enablejsapi=1`}
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
          controls
          playsInline
          preload="metadata"
          className={className || "w-full rounded-lg aspect-video bg-black"}
          controlsList={controlsList}
          onError={() => setFailed(true)}
        >
          <source src={source} type={file?.type || undefined} />
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
