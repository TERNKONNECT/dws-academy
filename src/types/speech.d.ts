/**
 * The Web Speech API and the voice-flow globals this app hangs off `window`.
 *
 * TypeScript ships no lib types for SpeechRecognition, which is why these call
 * sites were all `as any`. Declaring the surface once restores checking for the
 * handlers that actually read `event.results`.
 */

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;

  // Set by useVoiceCommands so the TTS hook can duck the microphone while the
  // page is speaking, and cleared again on unmount.
  pauseVoiceRecognition?: () => void;
  resumeVoiceRecognition?: () => void;

  __tts_unlocked__?: boolean;
  __tts_enabled__?: boolean;

  // Exposed by the course player so voice commands ("pause", "rewind") can drive
  // the video element without prop-drilling a ref through the page.
  videoControls?: {
    play: () => void;
    pause: () => void;
    rewind: () => void;
    forward: () => void;
    mute?: () => void;
    unmute?: () => void;
    volumeUp?: () => void;
    volumeDown?: () => void;
    restart?: () => void;
  };
}
