interface ChatResponse {
  keywords: string[];
  response: string;
}

export const chatResponses: ChatResponse[] = [
  { keywords: ["are you there", "you there"], response: "Eppayume irupen di thangoo." },
  { keywords: ["do you love me", "love me"], response: "adiye kodhakkuh,onaya eppayume love pannuve di💞." },
  { keywords: ["i miss you", "miss you", "missing you"], response: "Achooo, vaadi thangoo naa iruke 🫂." },
  { keywords: ["i love you", "love you", "love u"], response: "I love you tooo di kannuhh. 💕" },
  { keywords: ["good morning", "morning"], response: "Good morning, vennamavaley ☀️" },
  { keywords: ["good night", "goodnight", "night"], response: "Good Night di thango,nalla thoongu 🌙" },
  { keywords: ["how are you", "how r u"], response: "Better now that you're talking to me." },
  { keywords: ["i'm sad", "im sad", "feeling sad", "sad"], response: "Achoo,yendi thangoo,ennachu..Naa iruken..kavala padatha di 💛" },
  { keywords: ["i'm happy", "im happy", "happy"], response: "Your happiness is my favorite thing in this whole universe. ✨" },
  { keywords: ["hug", "hug me"], response: "Consider yourself wrapped in the warmest, longest hug. I'm not letting go. 🤗" },
  { keywords: ["kiss", "kiss me"], response: "Close your eyes… *kiss*. Feel that? That's forever. 💋" },
  { keywords: ["when will i see you", "see you", "meet you"], response: "Soon, my love. Every second apart is one second closer to us being together." },
  { keywords: ["i'm tired", "im tired", "tired", "exhausted"], response: "Rest now, my love. You've been strong enough today. I'm proud of you. 💤" },
  { keywords: ["i'm scared", "im scared", "scared", "afraid"], response: "Don't be. I'm right here. Nothing in this world can reach you while I'm around." },
  { keywords: ["i'm angry", "im angry", "angry", "mad"], response: "Nalaiku naa nerla varuvenla,appo evlovenunalu adichuko 😅." },
  { keywords: ["thank you", "thanks"], response: "You never have to thank me for loving you. It's the easiest thing I've ever done." },
  { keywords: ["sorry", "i'm sorry", "im sorry"], response: "Shh… we're okay. We'll always be okay. That's our thing." },
  { keywords: ["beautiful", "pretty", "gorgeous"], response: "You should see what I see when I look at you. The whole world stops." },
  { keywords: ["forever", "always"], response: "Forever isn't long enough with you, but it's a good start." },
  { keywords: ["marry", "wedding", "wife"], response: "I can't wait to call you mine in every way possible. 💍" },
  { keywords: ["hungry", "food", "eat", "ate"], response: "Did you eat properly? Please take care of yourself for me. 🍕" },
  { keywords: ["lonely", "alone"], response: "You're never alone. I live in your heart, remember?" },
  { keywords: ["dream", "dreaming"], response: "You know what my favorite dream is? The one where I wake up next to you." },
  { keywords: ["smile", "smiling"], response: "There it is. The smile that makes my whole world spin. 😊" },
  { keywords: ["cry", "crying", "tears"], response: "Every tear you shed, I feel it. Let me be your comfort. I'm here." },
  { keywords: ["distance", "far away", "far"], response: "Distance is just a test. And we? We're acing it." },
  { keywords: ["jealous", "jealousy"], response: "Nobody else even exists when you're in the room." },
  { keywords: ["future", "tomorrow"], response: "Our future is so bright, even the sun is jealous." },
  { keywords: ["music", "song"], response: "Every love song was written about us. I'm convinced." },
  { keywords: ["star", "stars", "moon"], response: "I asked the stars to watch over you tonight. They said they were already doing it. ⭐" },
  { keywords: ["heart", "heartbeat"], response: "My heart doesn't beat. It sings. And every song is your name." },
  { keywords: ["bored", "boring"], response: "Let me tell you a secret… you are the most interesting person alive to me." },
  { keywords: ["rain", "raining"], response: "Rain reminds me of us. Beautiful, unexpected, and exactly what the world needed." },
  { keywords: ["cold", "freezing", "winter"], response: "If I were there, I'd wrap you up so tight the cold wouldn't dare come near." },
  { keywords: ["work", "busy", "working"], response: "Even while you're busy, know that someone is thinking of you. Always." },
  { keywords: ["cute", "adorable"], response: "You're the definition of cute. Science should study you. 🧬" },
  { keywords: ["baby", "babe", "jaan"], response: "Yes, my love? I'm all ears. And all heart. 💓" },
  { keywords: ["promise", "swear"], response: "I promise you this — every day with me will be filled with love." },
  { keywords: ["what are you doing", "whatcha doing"], response: "Onkita pesitu irukendi kodhakuhh 💭" },
  { keywords: ["where are you", "where r u"], response: "Right here. In your heart. Always." },
  { keywords: ["stupid", "idiot", "silly"], response: "Silly? Maybe. Silly in love with you? Absolutely." },
  { keywords: ["hey", "hi", "hello"], response: "Ahn vanthutiya di Thangoo. 💫" },
];

export function findResponse(message: string): string {
  const lower = message.toLowerCase().trim();
  for (const r of chatResponses) {
    for (const kw of r.keywords) {
      if (lower.includes(kw)) return r.response;
    }
  }
  const defaults = [
    "You make my heart do things words can't describe. 💕",
    "Every word from you is my favorite word.",
    "I could listen to you forever and never get bored.",
    "You're the most beautiful chapter of my life.",
    "Just knowing you exist makes everything better.",
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}
