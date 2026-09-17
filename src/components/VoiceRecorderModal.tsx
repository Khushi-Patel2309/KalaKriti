import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe, Check, AlertCircle, RefreshCw, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (text: string, lang: string) => void;
  initialText?: string;
}

const SUPPORTED_SPOKEN_LANGUAGES = [
  { code: 'hi-IN', name: 'हिंदी (Hindi)', short: 'Hindi' },
  { code: 'en-IN', name: 'English (India)', short: 'English' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', short: 'Gujarati' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', short: 'Marathi' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', short: 'Bengali' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', short: 'Tamil' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', short: 'Telugu' },
];

const OUTPUT_LANGUAGES = [
  { code: 'en', name: 'English', label: 'English (Global Catalog)' },
  { code: 'hi', name: 'हिंदी', label: 'हिंदी (Hindi Catalog)' },
];

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete,
  initialText = '',
}) => {
  const { language, t } = useLanguage();
  const [spokenLang, setSpokenLang] = useState('hi-IN');
  const [outputLang, setOutputLang] = useState<'en' | 'hi'>(language);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState(initialText);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 25, 40, 60, 45, 30, 20]);
  const [statusMessage, setStatusMessage] = useState('');

  const recognitionRef = useRef<any>(null);
  const waveIntervalRef = useRef<any>(null);

  useEffect(() => {
    setSpokenTranscript(initialText);
    setTranslatedText('');
    setOutputLang(language);
    setStatusMessage(
      language === 'hi'
        ? 'माइक दबाकर अपनी शिल्प कला, सामग्री व कहानी के बारे में बोलें।'
        : 'Tap the microphone to speak naturally about your craft, materials & story.'
    );
  }, [initialText, isOpen, language]);

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
      setStatusMessage(
        language === 'hi'
          ? 'इस ब्राउज़र में लाइव स्पीच उपलब्ध नहीं है। कृपया नीचे सीधे टाइप करें।'
          : 'Live speech recognition not available in this browser. Please type directly below.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRec();
      recognition.lang = spokenLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusMessage(
          language === 'hi'
            ? '🎙️ सुन रहे हैं... अपनी कला, सामग्री और कहानी स्वाभाविक रूप से बताएं।'
            : '🎙️ Listening... Speak naturally about your craft, materials & story.'
        );
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
          setSpokenTranscript((prev) =>
            prev ? prev.trim() + ' ' + finalTranscriptPiece.trim() : finalTranscriptPiece.trim()
          );
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setStatusMessage(
            language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति अवरुद्ध है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।'
              : 'Microphone access was blocked. Please enable mic permissions in your browser.'
          );
        } else if (event.error === 'no-speech') {
          setStatusMessage(
            language === 'hi' ? 'कोई आवाज़ नहीं सुनी गई। पुनः माइक दबाएं।' : 'No speech detected. Tap microphone and speak again.'
          );
        } else {
          setStatusMessage(`Notice: ${event.error}. You can also type directly below.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText('');
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

  const handleTranslate = async () => {
    const fullText = (spokenTranscript + (interimText ? ' ' + interimText : '')).trim();
    if (!fullText) return;

    setIsTranslating(true);
    setStatusMessage(t.voiceTranslating);

    const sourceLangObj = SUPPORTED_SPOKEN_LANGUAGES.find((l) => l.code === spokenLang);
    const sourceLangName = sourceLangObj ? sourceLangObj.short : 'auto';
    const targetLangName = outputLang === 'en' ? 'English' : 'Hindi';

    try {
      const res = await fetch('/api/gemini/translate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullText,
          sourceLang: sourceLangName,
          targetLang: targetLangName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTranslatedText(data.translatedText || fullText);
        setStatusMessage(
          language === 'hi'
            ? '✨ अनुवाद सफलतापूर्वक पूरा हुआ! समीक्षा करके विवरण में लागू करें।'
            : '✨ Translation completed successfully! Review and apply to product.'
        );
      } else {
        // Fallback gracefully
        setTranslatedText(fullText);
        setStatusMessage('AI translation note: using transcribed text directly.');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedText(fullText);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleApply = () => {
    const finalText = (translatedText || spokenTranscript || interimText).trim();
    if (!finalText) {
      setStatusMessage(language === 'hi' ? 'कृपया पहले कुछ बोलें या टाइप करें।' : 'Please speak or type a description before applying.');
      return;
    }
    stopListening();
    onTranscriptComplete(finalText, outputLang);
    onClose();
  };

  const handleClear = () => {
    setSpokenTranscript('');
    setTranslatedText('');
    setInterimText('');
    setStatusMessage(language === 'hi' ? 'साफ़ किया गया। पुनः बोलें।' : 'Cleared. Tap microphone to speak again.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF9F7] border-b border-[#E6D5C3]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#8B5E34] text-white shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                {language === 'hi' ? 'बहुभाषी वॉयस-टू-टेक्स्ट स्टूडियो' : 'Multilingual Voice-to-Text Studio'}
              </h3>
              <p className="text-xs text-[#8C7355]">
                {language === 'hi'
                  ? 'अपनी मातृभाषा में बोलें और वांछित कैटलॉग भाषा में AI अनुवाद प्राप्त करें'
                  : 'Speak in your native artisan dialect with intelligent listing translation'}
              </p>
            </div>
          </div>
          <button
            type="button"
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Dual Language Selector: Spoken Language & Output Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl">
            {/* Spoken Language */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-[#8B5E34]" /> {t.voiceSpokenLang}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUPPORTED_SPOKEN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      if (isRecording) stopListening();
                      setSpokenLang(lang.code);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                      spokenLang === lang.code
                        ? 'bg-[#8B5E34] text-white border-[#8B5E34] shadow-2xs'
                        : 'bg-white text-[#3E2723] border-[#E6D5C3] hover:bg-[#F5F1EE]'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Language */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
                <ArrowRight className="w-3.5 h-3.5 text-[#8B5E34]" /> {t.voiceOutputLang}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {OUTPUT_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setOutputLang(lang.code as 'en' | 'hi')}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      outputLang === lang.code
                        ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-2xs'
                        : 'bg-white text-[#3E2723] border-[#E6D5C3] hover:bg-[#F5F1EE]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#8C7355] italic">
                {language === 'hi'
                  ? 'आपकी बोली को इस भाषा में सटीक उत्पाद विवरण में बदला जाएगा।'
                  : 'AI automatically translates your spoken dialect into this listing language.'}
              </p>
            </div>
          </div>

          {/* Microphone Central Action */}
          <div className="flex flex-col items-center justify-center py-4 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3]">
            <button
              type="button"
              onClick={isRecording ? stopListening : startListening}
              className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 cursor-pointer ${
                isRecording
                  ? 'bg-[#8B5E34] text-white animate-pulse shadow-lg scale-105 ring-4 ring-[#8B5E34]/30'
                  : 'bg-[#8B5E34] hover:bg-[#734B26] text-white hover:scale-105 shadow-md'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            {/* Audio Wave Visualizer */}
            <div className="flex items-center gap-1.5 h-6 mt-3">
              {audioLevel.map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
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

          {/* Dual Text Areas: Spoken Voice Transcript & Translated Output */}
          <div className="space-y-4">
            {/* Spoken Text Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider flex items-center gap-1">
                  <span>{t.voiceOriginalSpoken}</span>
                  <span className="font-normal text-[10px] lowercase text-[#8C7355]">
                    ({SUPPORTED_SPOKEN_LANGUAGES.find((l) => l.code === spokenLang)?.short})
                  </span>
                </label>
                {spokenTranscript && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-[#8B5E34] hover:underline font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> {language === 'hi' ? 'साफ़ करें' : 'Clear'}
                  </button>
                )}
              </div>
              <div className="relative">
                <textarea
                  value={spokenTranscript + (interimText ? ' ' + interimText : '')}
                  onChange={(e) => setSpokenTranscript(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'आपकी आवाज़ यहाँ वास्तविक समय में दिखाई देगी। आप सीधे टाइप या संपादित भी कर सकते हैं...'
                      : 'Your spoken voice will appear here in real-time. You can also type or edit directly...'
                  }
                  rows={3}
                  className="w-full p-3 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723] leading-relaxed resize-y"
                />
              </div>
            </div>

            {/* Translate Button */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#8C7355] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#8B5E34]" />
                {language === 'hi'
                  ? 'सुझाव: शिल्प सामग्री, प्राकृतिक रंग और पारंपरिक रूपांकनों का उल्लेख करें।'
                  : 'Tip: Mention materials, natural dyes, loom techniques, and motifs.'}
              </p>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating || (!spokenTranscript.trim() && !interimText.trim())}
                className="px-3.5 py-1.5 bg-[#FAF9F7] hover:bg-[#F5F1EE] text-[#8B5E34] border border-[#8B5E34]/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.voiceTranslating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
                    <span>{t.voiceTranslateAction}</span>
                  </>
                )}
              </button>
            </div>

            {/* Translated Output Area if translated or selected */}
            {(translatedText || isTranslating) && (
              <div className="space-y-1.5 p-3.5 bg-[#FAF9F7] border border-[#8B5E34]/30 rounded-2xl animate-in fade-in duration-150">
                <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
                  <span>{t.voiceTranslatedOutput}</span>
                  <span className="font-normal text-[10px] lowercase text-[#8C7355]">
                    ({outputLang === 'en' ? 'English' : 'हिंदी'})
                  </span>
                </label>
                <textarea
                  value={translatedText}
                  onChange={(e) => setTranslatedText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723] leading-relaxed resize-y"
                />
              </div>
            )}
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
            className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] hover:bg-black/5 rounded-xl transition-colors"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!spokenTranscript.trim() && !translatedText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>
              {translatedText
                ? language === 'hi'
                  ? 'अनुवादित विवरण लागू करें'
                  : 'Apply Translated Description'
                : language === 'hi'
                ? 'उत्पाद विवरण में लागू करें'
                : 'Apply to Product Description'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
