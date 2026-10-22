import React, { useState } from 'react';
import {
  MessageSquareText,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  apprenticeName: string;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

const PRESET_QUESTIONS = [
  '¿Cuántos días tengo para justificar una inasistencia médica?',
  '¿Cuál es la diferencia entre medida formativa y sanción?',
  '¿Qué alternativas tengo para hacer la etapa productiva?',
  '¿Cómo puedo solicitar un segundo calificador si no estoy de acuerdo con una nota?',
  '¿Qué derechos tengo si me citan a Comité de Evaluación y Seguimiento?'
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  apprenticeName
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `¡Hola ${apprenticeName.split(' ')[0] || 'Aprendiz'}! Soy SofIA, tu asesora virtual sobre el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024). ¿En qué duda sobre tus derechos, deberes, comités o etapas de formación te puedo orientar hoy?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Local expert fallback knowledge base for instant answers
  const getLocalRegulationAnswer = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('inasistencia') || q.includes('falta') || q.includes('médic') || q.includes('incapacidad') || q.includes('días')) {
      return `⏱️ **Justificación de Inasistencias (Acuerdo 009 de 2024):**
Tienes un plazo máximo de **tres (3) días hábiles** siguientes a la ocurrencia del hecho o de tu reincorporación para radicar la justificación formal ante tu instructor con copia a la coordinación. Debe estar soportada con documento oficial de tu EPS o certificación de fuerza mayor. Si no la justificas a tiempo, el sistema puede reportarte en proceso de deserción.`;
    }
    if (q.includes('diferencia') || q.includes('medida formativa') || q.includes('sanción')) {
      return `⚖️ **Medida Formativa vs Sanción:**
- **Medidas Formativas:** Tienen carácter **pedagógico y preventivo**. Incluyen el llamado de atención verbal y los Planes de Mejoramiento (académico o disciplinario). **NO** se registran como antecedente sancionatorio en tu hoja de vida.
- **Sanciones:** Son medidas punitivas impuestas por el Subdirector de Centro tras dictamen del Comité de Evaluación (Llamado de atención escrito, Condicionamiento de matrícula y Cancelación de matrícula). Estas sí se archivan formalmente en SofiaPlus/Zajuna.`;
    }
    if (q.includes('etapa productiva') || q.includes('práctica') || q.includes('alternativa') || q.includes('contrato')) {
      return `💼 **Alternativas para la Etapa Productiva SENA:**
El SENA te ofrece múltiples modalidades legales:
1. **Contrato de Aprendizaje:** Vínculo de formación con patrocinio económico de una empresa y afiliación a EPS y ARL.
2. **Proyecto Productivo:** Creación o fortalecimiento de tu propia unidad de negocio con apoyo de Fondo Emprender.
3. **Pasantía formativa:** Práctica en empresas u ONGs afines a tus competencias.
4. **Vinculación Laboral previa:** Si ya trabajas en funciones directamente relacionadas con tu programa formativo.
5. **Monitoría:** Apoyo técnico y pedagógico dentro del mismo SENA.`;
    }
    if (q.includes('nota') || q.includes('calificación') || q.includes('segundo calificador') || q.includes('injust')) {
      return `📝 **Derecho de Réplica y Segundo Calificador:**
1. Dentro de los **tres (3) días hábiles** siguientes a la publicación del resultado, tienes derecho a solicitar por escrito a tu instructor la revisión detallada de tu evidencia.
2. Si tras la revisión persiste el desacuerdo justificado, puedes elevar una solicitud formal a la **Coordinación Académica** pidiendo la designación de un **Segundo Calificador** (un instructor par que revisará de manera imparcial tu trabajo).`;
    }
    if (q.includes('comité') || q.includes('evaluación y seguimiento') || q.includes('descargo') || q.includes('defens')) {
      return `🛡️ **Garantías ante el Comité de Evaluación y Seguimiento:**
Gozas de la plena garantía constitucional del **Debido Proceso (Art. 29 C.P. y Acuerdo 009 de 2024)**:
- Debes ser citado por escrito con anticipación, conociendo con claridad los hechos y pruebas en tu contra.
- Tienes derecho a presentar tus descargos de forma oral o escrita, aportar documentos y solicitar testimonios.
- Puedes estar acompañado por tu Representante de Aprendices.
- Si se emite una sanción, tienes derecho a interponer el **Recurso de Reposición** dentro de los cinco (5) días hábiles siguientes ante la Subdirección.`;
    }
    return `📚 **Orientación General del Reglamento SENA:**
En el marco del **Acuerdo 009 de 2024**, todo aprendiz es el centro de la Formación Profesional Integral. Recuerda que la institución promueve el diálogo pedagógico a través de los Planes de Mejoramiento antes de recurrir a sanciones, siempre velando por el respeto mutuo, el Código de Integralidad y el uso honesto de las herramientas formativas. Si tienes una consulta específica sobre tu ficha o centro, acude a tu Vocero de Aprendices o a la Coordinación Académica.`;
  };

  const handleSendMessage = async (userQuery?: string) => {
    const queryToSend = userQuery || input;
    if (!queryToSend.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: queryToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Check if Gemini API is available through environment variable
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Eres SofIA, una tutora y consejera pedagógica experta en el Reglamento del Aprendiz SENA (Colombia), regida por el Acuerdo 009 de 2024 (que actualizó el Acuerdo 007 de 2012).
El aprendiz se llama ${apprenticeName}. Responde de forma clara, motivadora, respetuosa, legalmente fundamentada y concisa (máximo 3 párrafos cortos) con viñetas.
Pregunta del aprendiz: "${queryToSend}"`
        });
        const replyText = response.text || getLocalRegulationAnswer(queryToSend);
        setMessages([...newMessages, { role: 'assistant', text: replyText }]);
      } else {
        // Instant verified local expert answer
        setTimeout(() => {
          const reply = getLocalRegulationAnswer(queryToSend);
          setMessages([...newMessages, { role: 'assistant', text: reply }]);
          setIsLoading(false);
        }, 400);
        return;
      }
    } catch (err) {
      const fallbackReply = getLocalRegulationAnswer(queryToSend);
      setMessages([...newMessages, { role: 'assistant', text: fallbackReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xl w-full h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#00324D] dark:bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#39A900] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">SofIA — Asesora SENA</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Reglamento 2024
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Resuelve dudas sobre derechos, deberes y normatividad SENA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/80">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#39A900] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                  S
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#00324D] dark:bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs rounded-tl-xs whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                  {apprenticeName ? apprenticeName.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 rounded-full bg-[#39A900] text-white flex items-center justify-center text-xs font-bold animate-pulse">
                S
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span>SofIA está consultando el Acuerdo 009 de 2024...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-x-auto whitespace-nowrap space-x-2 scrollbar-none">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="inline-block text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-800 dark:hover:text-emerald-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a SofIA sobre una regla, falta o derecho..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-slate-800"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
