import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Globe, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (text: string, lang: string) => void;
  initialText?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', name: 'हिंदी (Hindi)', label: 'हिंदी' },
  { code: 'en-IN', name: 'English (India)', label: 'English' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', label: 'ગુજરાતી' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', label: 'मराठी' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', label: 'বাংলা' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', label: 'தமிழ்' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', label: 'తెలుగు' },
];

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete,
  initialText = '',
}) => {
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [interimText, setInterimText] = useState('');
  const [supportSpeech, setSupportSpeech] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 25, 40, 60, 45, 30, 20]);
  const [statusMessage, setStatusMessage] = useState('Tap the microphone to begin speaking');
  const recognitionRef = useRef<any>(null);
  const waveIntervalRef = useRef<any>(null);

  useEffect(() => {
    setTranscript(initialText);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSupportSpeech(false);
      setStatusMessage('Live speech recognition is not supported in this browser. You can type or use fallback recording.');
    }
  }, [initialText, isOpen]);

  useEffect(() => {
    if (isRecording) {
      waveIntervalRef.current = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 40) + 15,
          Math.floor(Math.random() * 65) + 20,
          Math.floor(Math.random() * 85) + 30,
          Math.floor(Math.random() * 100) + 40,
          Math.floor(Math.random() * 75) + 25,
          Math.floor(Math.random() * 50) + 20,
          Math.floor(Math.random() * 30) + 10,
        ]);
      }, 100);
    } else {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      setAudioLevel([12, 18, 25, 30, 25, 18, 12]);
    }
    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isRecording]);

  const startListening = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setStatusMessage('Speech recognition not available. Please type your description directly below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRec();
      recognition.lang = selectedLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusMessage('🎙️ Listening... Speak naturally about your craft, materials & story.');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscriptPiece = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptPiece += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTranscriptPiece) {
          setTranscript((prev) => (prev ? prev.trim() + ' ' + finalTranscriptPiece.trim() : finalTranscriptPiece.trim()));
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setStatusMessage('Microphone access was blocked. Please enable mic permissions in your browser bar.');
        } else if (event.error === 'no-speech') {
          setStatusMessage('No speech detected. Tap microphone and speak again.');
        } else {
          setStatusMessage(`Microphone notice (${event.error}). You can continue speaking or edit text below.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText('');
        if (transcript.trim()) {
          setStatusMessage('Speech converted to text successfully! Review, edit if needed, and apply.');
        } else {
          setStatusMessage('Recording ended. Tap microphone to record again or type directly.');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      setIsRecording(false);
      setStatusMessage('Could not start microphone. Please type your description below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleApply = () => {
    const fullText = (transcript + (interimText ? ' ' + interimText : '')).trim();
    if (!fullText) {
      setStatusMessage('Please speak or type a description before applying.');
      return;
    }
    stopListening();
    onTranscriptComplete(fullText, selectedLang);
    onClose();
  };

  const handleClear = () => {
    setTranscript('');
    setInterimText('');
    setStatusMessage('Cleared. Tap microphone to speak again.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-xl overflow-hidden bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF9F7] border-b border-[#E6D5C3]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#8B5E34] text-white shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">Voice-to-Text Studio</h3>
              <p className="text-xs text-[#8C7355]">Speak in your native language — instant AI text transcription</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="text-[#8C7355] hover:text-[#3E2723] p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Language Selector Bar */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-[#8B5E34]" /> Select Your Spoken Language
            </label>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    if (isRecording) stopListening();
                    setSelectedLang(lang.code);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    selectedLang === lang.code
                      ? 'bg-[#8B5E34] text-white border-[#8B5E34] shadow-xs'
                      : 'bg-[#FAF9F7] text-[#3E2723] border-[#E6D5C3] hover:bg-[#F5F1EE]'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Microphone Central Action */}
          <div className="flex flex-col items-center justify-center py-4 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3]">
            <button
              type="button"
              onClick={isRecording ? stopListening : startListening}
              className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
                isRecording
                  ? 'bg-[#8B5E34] text-white animate-pulse shadow-lg scale-105 ring-4 ring-[#8B5E34]/30'
                  : 'bg-[#8B5E34] hover:bg-[#734B26] text-white hover:scale-105 shadow-md'
              }`}
            >
              {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </button>

            {/* Audio Wave Visualizer */}
            <div className="flex items-center gap-1.5 h-8 mt-4">
              {audioLevel.map((height, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isRecording ? 'bg-[#8B5E34]' : 'bg-[#E6D5C3]'
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <p className="text-xs font-medium text-[#3E2723] text-center mt-2 px-4 max-w-md">
              {statusMessage}
            </p>
          </div>

          {/* Live Text Area Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
                Converted Voice Text
              </label>
              {transcript && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#8B5E34] hover:underline font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Clear Text
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                value={transcript + (interimText ? ' ' + interimText : '')}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your voice will appear here in real-time. You can also type or edit this text directly..."
                rows={4}
                className="w-full p-3.5 text-sm bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] focus:outline-hidden text-[#3E2723] leading-relaxed resize-y"
              />
              {interimText && (
                <span className="absolute bottom-3 right-3 text-[11px] bg-[#F5F1EE] text-[#8B5E34] px-2 py-0.5 rounded-md font-mono border border-[#E6D5C3]">
                  Translating live...
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8C7355] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#8B5E34]" />
              Tip: Mention materials (e.g. Kala cotton, Sheesham wood), crafting time, traditional motifs, and natural dyes.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#FAF9F7] border-t border-[#E6D5C3]">
          <button
            type="button"
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold text-[#8C7355] hover:text-[#3E2723] hover:bg-black/5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!transcript.trim() && !interimText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
          >
            <Check className="w-4 h-4" /> Apply to Product Description
          </button>
        </div>
      </div>
    </div>
  );
};
