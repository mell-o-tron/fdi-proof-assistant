import { GoalParser } from "./goal_parser.js";
import { PlainTextifier } from "./to_plain_text.js";
import { TacticCommentator } from "./tactic_commentator.js";

class Visualizer {
    constructor() {
        this.parser = new GoalParser();
        this.plainTextifier = new PlainTextifier();
        this.tacticCommentator = new TacticCommentator();

        // List of tactics and terminators
        this.tactics = [
            "after", "apply", "assert", "auto", "autorewrite", "case", "change", "clear", "compute", "congruence", "constructor",
            "congr", "cut", "cutrewrite", "dependent", "destruct", "eapply", "eauto", "ecase", "econstructor", "edestruct", "ediscriminate",
            "eelim", "eenough", "eexists", "eexact", "einduction", "einjection", "eleft", "epose", "eright", "esplit", "elim", "enough",
            "exists", "field", "firstorder", "fold", "fourier", "generalize", "have", "hnf", "induction", "injection", "instantiate", "intro",
            "intros", "inversion", "left", "move", "pattern", "pose", "refine", "remember", "rename", "repeat", "replace", "revert", "rewrite",
            "right", "ring", "set", "simpl", "specialize", "split", "subst", "suff", "symmetry", "transitivity", "trivial", "try", "unfold",
            "unlock", "using", "vm_compute", "where", "wlog"
        ];
        this.terminators = [
            "assumption", "eassumption", "by", "contradiction", "discriminate", "easy", "exact", "now", "lia", "omega", "reflexivity", "tauto"
        ];
    }

    // Method to visualize the statement
    visualize(stmt) {
        let goal_html = document.getElementById("goal-text");

        if (stmt.text == "\nProof.") {
            let div = document.createElement("div");
            div.innerHTML = "<b>Proof:</b>\n";
            div.style.width = "100%";
            div.style.padding = "10px";
            document.getElementById("latex-proof").appendChild(div);
        } else if (stmt.text.startsWith("\nLemma")) {
            let div = document.createElement("div");
            div.innerHTML = `<b>Lemma</b> ${this.plainTextifier.theorem_to_plain_text(stmt.text, "Lemma")}\n`;
            div.style.width = "100%";
            div.style.padding = "10px";
            document.getElementById("latex-proof").appendChild(div);
        } else if (stmt.text.startsWith("\nTheorem")) {
            let div = document.createElement("div");
            div.innerHTML = `<b>Theorem</b> ${this.plainTextifier.theorem_to_plain_text(stmt.text, "Theorem")}\n`;
            div.style.width = "100%";
            div.style.padding = "10px";
            document.getElementById("latex-proof").appendChild(div);
        } else if (this.is_tactic(stmt)) {
            let comment = this.tacticCommentator.tactic_comment(stmt.text.trim().replace(/ .*/, '').replace(".", ""), stmt.text);
            this.visualize_goal(goal_html, comment);
        }
        MathJax.typeset();
    }

    // Method to visualize a goal
    visualize_goal(goal_html, comment) {
        let parsed_goal = this.parser.parse_goal(goal_html);
        console.log(parsed_goal);
        let text = this.plainTextifier.goal_to_plain_text(parsed_goal);

        if (text === undefined) return;

        if (comment !== undefined) {
            text = comment + "<br>" + text;
        }

        let div = document.createElement("div");
        div.innerHTML = text + "\n";
        div.style.width = "100%";
        div.style.border = "2px solid black";
        div.style.padding = "20px";
        div.style.marginBottom = "10px";
        document.getElementById("latex-proof").appendChild(div);
        MathJax.typeset();
    }

    // Check if the statement is a tactic
    is_tactic(stmt) {
        let stripped = stmt.text.trim().replace(/ .*/, '').replace(".", "");
        return this.tactics.includes(stripped) || this.terminators.includes(stripped);
    }
}

export { Visualizer };
