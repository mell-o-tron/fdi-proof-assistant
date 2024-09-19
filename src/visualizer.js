import {parse_goal} from "./goal_parser.js"
import {goal_to_plain_text} from "./to_plain_text.js"

function visualize_goal (){
    let goal_html =  document.getElementById("goal-text")
    let text = goal_to_plain_text(parse_goal(goal_html))
    
    /* TODO lmao */
    if (text == undefined) return;
    
    let div = document.createElement("div");
    div.innerHTML = text + "\n";
    div.style.width = "100%";
    div.style.border = "2px solid black";
    div.style.padding = "10px";
    document.getElementById("latex-proof").appendChild(div);
    let linebreak = document.createElement("br");
    document.getElementById("latex-proof").appendChild(linebreak);
    MathJax.typeset()
}

export {visualize_goal}
