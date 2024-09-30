import {parse_goal} from "./goal_parser.js"
import {goal_to_plain_text, theorem_to_plain_text} from "./to_plain_text.js"
import {tactic_comment} from "./tactic_commentator.js"

function visualize(stmt) {
    let goal_html =  document.getElementById("goal-text");
    if (stmt.text == "\nProof."){
        let div = document.createElement("div");
        div.innerHTML = "<b>Proof:</b>\n";
        div.style.width = "100%";
        div.style.padding = "10px";
        document.getElementById("latex-proof").appendChild(div);
        
    } else if (stmt.text.startsWith("\nLemma")){
        let div = document.createElement("div");
        div.innerHTML = `<b>Lemma</b> ${theorem_to_plain_text(stmt.text, "Lemma")}\n`;
        div.style.width = "100%";
        div.style.padding = "10px";
        document.getElementById("latex-proof").appendChild(div);
        
    } else if (stmt.text.startsWith("\nTheorem")){
        let div = document.createElement("div");
        div.innerHTML = `<b>Theorem</b> ${theorem_to_plain_text(stmt.text, "Theorem")}\n`;
        div.style.width = "100%";
        div.style.padding = "10px";
        document.getElementById("latex-proof").appendChild(div);
        
    } else if (is_tactic(stmt)) {
        let comment = tactic_comment(stmt.text.trim().replace(/ .*/,'').replace(".", ""), stmt.text);
        visualize_goal (goal_html, comment);
    }
    MathJax.typeset()
}

function visualize_goal (goal_html, comment){
    console.log(parse_goal(goal_html))
    let text = goal_to_plain_text(parse_goal(goal_html))

    /* TODO lmao */
    if (text == undefined) return;

    if (comment != undefined){
        text = comment + "<br>" + text;
    }
    
    let div = document.createElement("div");
    div.innerHTML = text + "\n";
    div.style.width = "100%";
    div.style.border = "2px solid black";
    div.style.padding = "20px";
    div.style.marginBottom = "10px";
    document.getElementById("latex-proof").appendChild(div);
    MathJax.typeset()
}


function is_tactic (stmt){
    var stripped = stmt.text.trim().replace(/ .*/,'').replace(".", "");
    return tactics.includes(stripped) || terminators.includes(stripped);
}

var tactics = [
      "after",
      "apply",
      "assert",
      "auto",
      "autorewrite",
      "case",
      "change",
      "clear",
      "compute",
      "congruence",
      "constructor",
      "congr",
      "cut",
      "cutrewrite",
      "dependent",
      "destruct",
      "eapply",
      "eauto",
      "ecase",
      "econstructor",
      "edestruct",
      "ediscriminate",
      "eelim",
      "eenough",
      "eexists",
      "eexact",
      "einduction",
      "einjection",
      "eleft",
      "epose",
      "eright",
      "esplit",
      "elim",
      "enough",
      "exists",
      "field",
      "firstorder",
      "fold",
      "fourier",
      "generalize",
      "have",
      "hnf",
      "induction",
      "injection",
      "instantiate",
      "intro",
      "intros",
      "inversion",
      "left",
      "move",
      "pattern",
      "pose",
      "refine",
      "remember",
      "rename",
      "repeat",
      "replace",
      "revert",
      "rewrite",
      "right",
      "ring",
      "set",
      "simpl",
      "specialize",
      "split",
      "subst",
      "suff",
      "symmetry",
      "transitivity",
      "trivial",
      "try",
      "unfold",
      "unlock",
      "using",
      "vm_compute",
      "where",
      "wlog"
    ];
var terminators = [
      "assumption",
      "eassumption",
      "by",
      "contradiction",
      "discriminate",
      "easy",
      "exact",
      "now",
      "lia",
      "omega",
      "reflexivity",
      "tauto"
    ];


export {visualize}
