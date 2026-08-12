import { useEffect, useRef, useState, useCallback } from "react";

interface VoiceCommand {
  command: string | string[] | RegExp;
  action: (match?: RegExpMatchArray) => void;
}

export function useVoiceCommands(
  commands: VoiceCommand[],
  enabled: boolean,
  onError?: (error: string) => void,
) {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isPausedRef = useRef(false);
  const enabledRef = useRef(enabled);
  const commandsRef = useRef(commands);

  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  useEffect(() => {
    window.pauseVoiceRecognition = () => {
      isPausedRef.current = true;
      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition was already in the requested state.
      }
    };
    window.resumeVoiceRecognition = () => {
      isPausedRef.current = false;
      if (enabledRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
        // Recognition was already in the requested state.
      }
      }
    };
    return () => {
      delete window.pauseVoiceRecognition;
      delete window.resumeVoiceRecognition;
    };
  }, []);

  const startRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError("Speech recognition not supported in this browser.");
      return;
    }

    try {
      recognitionRef.current?.stop();
    } catch {
        // Recognition was already in the requested state.
      }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (isPausedRef.current) return;
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.trim();
      setLastTranscript(transcript.toLowerCase());

      let matched = false;
      for (const cmd of commandsRef.current) {
        if (cmd.command instanceof RegExp) {
          const match = transcript.toLowerCase().match(cmd.command);
          if (match) {
            cmd.action(match);
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        for (const cmd of commandsRef.current) {
          if (!(cmd.command instanceof RegExp)) {
            const list = Array.isArray(cmd.command)
              ? cmd.command
              : [cmd.command];
            if (
              list.some((c) =>
                transcript.toLowerCase().includes(c.toLowerCase()),
              )
            ) {
              cmd.action();
              matched = true;
              break;
            }
          }
        }
      }
      setTimeout(() => setLastTranscript(""), 2000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setIsListening(false);
        if (onError)
          onError("Microphone access denied. Please allow microphone access.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isPausedRef.current || !enabledRef.current) return;
      setTimeout(() => {
        if (enabledRef.current && !isPausedRef.current) {
          try {
            recognition.start();
          } catch {
        // Recognition was already in the requested state.
      }
        }
      }, 300);
    };

    try {
      recognition.start();
    } catch {
        // Recognition was already in the requested state.
      }
  }, [onError]);

  useEffect(() => {
    if (!enabled) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition was already in the requested state.
      }
      setIsListening(false);
      return;
    }
    startRecognition();

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition was already in the requested state.
      }
      recognitionRef.current = null;
    };
  }, [enabled]);

  return { isListening, lastTranscript, isSupported, startRecognition };
}
