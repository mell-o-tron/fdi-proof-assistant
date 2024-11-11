import { TeXifier } from "./texifier.js"; // Import the PlainTextifier class


/* checks whether two goals are the same */
function same_goal (g1, g2){
  if (g1.goal != g2.goal){
    return false;
  }
  
  if (g1.hypotheses.length != g2.hypotheses.length){
    return false;
  }
  
  let hg1 = g1.hypotheses.sort((x, y) => `${x.name}${x.body}` > `${y.name}${y.body}`);
  let hg2 = g2.hypotheses.sort((x, y) => `${x.name}${x.body}` > `${y.name}${y.body}`);
  
  for (let i in hg1){
    let h1 = hg1[i];
    let h2 = hg2[i];
    if (h1.name != h2.name || h1.body != h2.body){
      return false
    }
  }
  return true;
  
}


class TacticCommentator {
    constructor(language_selector, observer) {
        this.texifier = new TeXifier();
        this.language_selector = language_selector;
        this.observer = observer;
        
        this.inductive_goal_stack = []; // for nested induction
        this.inductive_goal_history = [];     // stack of stacks, for undo
    }

    undo_stack() {
        this.inductive_goal_stack = this.inductive_goal_history.pop();
    }
    
    // Method to generate a comment based on the tactic
    tactic_comment(tactic, text, uncurrifier) {
        this.inductive_goal_history.push(structuredClone(this.inductive_goal_stack));
        console.log("INDUCTION HISTORY: ", this.inductive_goal_history)
        switch (tactic) {
            case "induction":
                let s = `${this.language_selector.current_language.BYINDUCTION} ${this.texifier.inline_math(text.replace("induction", "").replace(".", ""))}. `;
                s += `${this.language_selector.current_language.MUSTPROVEFOLLOWINGCLAUSES}:`;
                
                let new_goals = this.observer.new_goals;
                console.log("new goals are:", new_goals, new_goals.length)
                
                if(new_goals.length == 2){
                    this.inductive_goal_stack.push(new_goals[1]); // save inductive case goal
                                      
                    let ng0 = this.texifier.texify(uncurrifier.uncurrify(new_goals[0].goal));
                    
                    let hps1 = new_goals[1].hypotheses.map(x => `${x.name} : ${uncurrifier.uncurrify(x.body)}`).join(" \\\\")
                    
                    let ng1 = this.texifier.texify(`\\begin{gather*}${hps1} \\\\ \\Downarrow \\\\ ${uncurrifier.uncurrify(new_goals[1].goal)}\\end{gather*}`);
                    
                    let base_clause_text = this.language_selector.current_language.BASECLAUSE;
                    let inductive_clause_text = this.language_selector.current_language.INDUCTIVECLAUSE;
                    
                    s += `<ul style="margin : 20px;"><li>${base_clause_text}:${(ng0)}</li>`;
                    s += `<li>${inductive_clause_text}: ${(ng1)}</li></ul>`;
                } else{
                    // WARNING NOT TESTED
                    
                    s += `<ul style="margin : 20px>`;
                    for (let i in new_goals){
                        let hpsi = new_goals[i].hypotheses.map(x => `${x.name} : ${uncurrifier.uncurrify(x.body)}`).join(" \\\\ \\wedge \\;\\; &")
                        let ngi = this.texifier.texify(`\\begin{aligned}&${hpsi} \\\\ \\implies &${uncurrifier.uncurrify(new_goals[i].goal)}\\end{aligned}`);
                        s += `<li>(${(ng0)})</li>`;
                    }
                    s += "</ul>";
                }
                
                s += `${this.language_selector.current_language.BEGINFIRSTBASECLAUSE}. `;
                return s;

            case "intro":
                return `${this.language_selector.current_language.INTRO}.`;

            case "intros":
                return `${this.language_selector.current_language.INTROS}.`;

            case "reflexivity":
                let res = "";
                
                let cur_inductive_goal = this.inductive_goal_stack[this.inductive_goal_stack.length - 1];
                
                console.log("INDUCTIVE", cur_inductive_goal)
                console.log("CURRENT", this.observer.current_goal)
                console.log("STACK", this.inductive_goal_stack)
                
                res += `${this.language_selector.current_language.REFL}.`;
                
                if(cur_inductive_goal && same_goal(cur_inductive_goal, this.observer.current_goal)){
                    res += `<br><div style="text-align: center;"><b>` + this.language_selector.current_language.END_OF_BASE_CASE + "</b></div><br>"
                    
                    this.inductive_goal_stack.pop();
                    
                }
                return res;

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
