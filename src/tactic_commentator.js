import {goal_to_plain_text, theorem_to_plain_text, inline_math} from "./to_plain_text.js" 


function tactic_comment (tactic, text) {
    switch (tactic) {
        case "induction": return `We proceed by induction on ${inline_math(text.replace("induction", "").replace(".", ""))}.`; break;
        case "intro": return `We introduce a new hypothesis.`; break;
        case "intros": return `We introduce all new hypotheses.`; break;
    }
}


export { tactic_comment }
