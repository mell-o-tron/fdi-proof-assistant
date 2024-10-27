import { TeXifier } from "./texifier.js"; // Import the PlainTextifier class

class TacticCommentator {
    constructor(language_selector) {
        this.texifier = new TeXifier(); // Create an instance of PlainTextifier for inline_math
        this.language_selector = language_selector;
    }

    // Method to generate a comment based on the tactic
    tactic_comment(tactic, text) {
        switch (tactic) {
            case "induction":
                return `${this.language_selector.current_language.BYINDUCTION} ${this.texifier.inline_math(text.replace("induction", "").replace(".", ""))}.`;

            case "intro":
                return `${this.language_selector.current_language.INTRO}.`;

            case "intros":
                return `${this.language_selector.current_language.INTROS}.`;

            case "reflexivity":
                return `${this.language_selector.current_language.REFL}.`;

            case "rewrite":
                let direction = text.includes("<-") ? `${this.language_selector.current_language.RIGHTTOLEFT}` : `${this.language_selector.current_language.LEFTTORIGHT}`;
                return `We apply: ${this.texifier.inline_math("\\texttt{" + text.replace("rewrite", "")
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
