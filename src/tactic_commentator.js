import {goal_to_plain_text, theorem_to_plain_text, inline_math} from "./to_plain_text.js" 


function tactic_comment (tactic, text) {
    switch (tactic) {
        case "induction": return `We proceed by induction on ${inline_math(text.replace("induction", "").replace(".", ""))}.`; 
        case "intro": return `We introduce a new hypothesis.`; 
        case "intros": return `We introduce all new hypotheses.`; 
        case "reflexivity": return `The two sides are the same: we apply the reflexivity property.`;
        case "rewrite": 
            var direction = text.includes("<-") ? `from right to left` : `from left ro right`;
            return `We apply the theorem: ${inline_math("\\texttt{" + text.replace("rewrite", "").replace(".", "").replace("->", "").replace("<-", "").replaceAll("_", "\_").trim() + "}")} ${direction}.`
    }
}


export { tactic_comment }
