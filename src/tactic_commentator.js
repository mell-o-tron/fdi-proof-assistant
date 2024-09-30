import { PlainTextifier } from "./to_plain_text.js"; // Import the PlainTextifier class

class TacticCommentator {
    constructor() {
        this.plainTextifier = new PlainTextifier(); // Create an instance of PlainTextifier for inline_math
    }

    // Method to generate a comment based on the tactic
    tactic_comment(tactic, text) {
        switch (tactic) {
            case "induction":
                return `We proceed by induction on ${this.plainTextifier.inline_math(text.replace("induction", "").replace(".", ""))}.`;

            case "intro":
                return `We introduce a new hypothesis.`;

            case "intros":
                return `We introduce all new hypotheses.`;

            case "reflexivity":
                return `The two sides are the same: we apply the reflexivity property.`;

            case "rewrite":
                let direction = text.includes("<-") ? `from right to left` : `from left to right`;
                return `We apply the theorem: ${this.plainTextifier.inline_math("\\texttt{" + text.replace("rewrite", "")
                    .replace(".", "")
                    .replace("->", "")
                    .replace("<-", "")
                    // .replaceAll("_", "\\_")
                    .trim() + "}")} ${direction}.`;

            default:
                return "";
        }
    }
}

export { TacticCommentator };
