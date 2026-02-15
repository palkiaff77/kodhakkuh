import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findResponse } from "@/data/chatResponses";

interface Message {
  from: "user" | "portal";
  text: string;
}

const ChatOrb = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);
    setTyping(true);

    const response = findResponse(text);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "portal", text: response }]);
    }, 1200 + Math.random() * 800);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="flex flex-col gap-4 h-[70vh]">
      <h3 className="text-2xl font-serif text-foreground text-glow text-center">💬 Talk To Me</h3>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 px-2 scrollbar-hide">
        <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground font-sans mt-8 italic">
            Say anything… I'm always here.
          </p>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-sans ${
                  msg.from === "user"
                    ? "bg-primary/20 text-foreground rounded-br-md"
                    : "glass text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass px-4 py-2.5 rounded-2xl rounded-bl-md flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/60"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something…"
          className="flex-1 px-4 py-3 rounded-xl glass text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="px-4 py-3 rounded-xl glass text-foreground hover:box-glow transition-all"
        >
          💕
        </motion.button>
      </form>
    </div>
  );
};

export default ChatOrb;
