import { TeXifier } from "./texifier.js";
import { TacticCommentator } from "./tactic_commentator.js";
import {LanguageSelector} from "./multilang.js"

class Visualizer {
    constructor(observer, language_selector) {
        this.observer = observer;
        this.tacticCommentator = new TacticCommentator(language_selector);
        this.texifier = new TeXifier()
        this.language_selector = language_selector;

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
        if (this.is_tactic(stmt)) {
            let comment = this.tacticCommentator.tactic_comment(stmt.text.trim().replace(/ .*/, '').replace(".", ""), stmt.text);
            this.visualize_goal(comment);
        }
        MathJax.typeset();
    }

    // Method to visualize a goal
    visualize_goal(comment) {
        
        let vis_fun = () => {
            
            if(!this.observer.has_goals){
                let box = document.createElement("div");
                box.className = 'math-box';
                
                let header = document.createElement('div');
                header.className = `math-header theorem-header`;
                header.textContent = this.language_selector.current_language.CONCLUDED;
                
                let content = document.createElement('div');
                content.className = 'math-content';
                content.style["text-align"] = "center";
                content.innerHTML = "";
                
                const QED = new Image(300);
                QED.src = "./imgs/QED.png";
                content.appendChild(QED);
                
                box.appendChild(header);
                box.appendChild(content);

                document.getElementById("latex-proof").appendChild(box);
                return;
            }
            
            let text = ""
            if (this.observer.current_goal.hypotheses.length > 0) {
                text += this.language_selector.current_language.ASSUMING; //"Assuming the following hypotheses:";
                for (let h of this.observer.current_goal.hypotheses){
                    text += this.texifier.texify (`\\textit{${h.name}}` + " : " + h.body)
                }
            }
            
            text += `${this.language_selector.current_language.PROVE}:` + this.texifier.texify(this.observer.current_goal.goal);

            if (text === undefined) return;

            if (comment !== undefined) {
                text = comment + " " + text;
            }

            let box = document.createElement("div");
            box.className = 'math-box';
            
            let header = document.createElement('div');
            header.className = `math-header step-header`;
            header.textContent = this.language_selector.current_language.PROOFSTEP;
            
            let content = document.createElement('div');
            content.className = 'math-content';
            content.innerHTML = text;
            
            box.appendChild(header);
            box.appendChild(content);

            document.getElementById("latex-proof").appendChild(box);
            
            MathJax.typeset();
        }
        
        this.observer.vis_fun = vis_fun;
        
        
    }

    // Check if the statement is a tactic
    is_tactic(stmt) {
        let stripped = stmt.text.trim().replace(/ .*/, '').replace(".", "");
        return this.tactics.includes(stripped) || this.terminators.includes(stripped);
    }
    
    visualize_math(d, type){
        let local_langsel = new LanguageSelector();

        let text = (d.text[`${local_langsel.current_language.language_name}`]);
        let box = document.createElement("div");
        box.className = 'math-box';
        
        let header = document.createElement('div');
        header.className = `math-header ${type}-header`;
        header.textContent = local_langsel.current_language[`${type}`]
        
        let content = document.createElement('div');
        content.className = 'math-content';
        content.innerHTML = text;
        
        box.appendChild(header);
        box.appendChild(content);

        document.getElementById("latex-proof").appendChild(box);
        MathJax.typeset();
    }

    add_theo_card(at, controller) {
        let local_langsel = new LanguageSelector();

        let theobox = document.createElement("div");
        theobox.className = 'theorem-card';
        let theodesc = document.createElement("div");
        theodesc.className = 'math-content';

        theodesc.textContent = at.text[`${local_langsel.current_language.language_name}`];
        document.getElementById("available_theorems").appendChild(theobox);

        let header = document.createElement('div');
        header.className = "math-header theorem-header";
        header.textContent = at.name;

        let rw_lr = document.createElement("button");
        rw_lr.className = "button-4";
        rw_lr.textContent = `${local_langsel.current_language.APPLY} (🡒)`;
        rw_lr.onclick = () => {controller.rewrite_theorem(at.name, true)};

        let rw_rl = document.createElement("button");
        rw_rl.className = "button-4";
        rw_rl.onclick = () => {controller.rewrite_theorem(at.name, false)};
        rw_rl.textContent = `${local_langsel.current_language.APPLY} (🡐)`;
        
        theobox.appendChild(header);
        theobox.appendChild(theodesc);
        theobox.appendChild(rw_lr);
        theobox.appendChild(rw_rl);
        MathJax.typeset();
    }

    add_tactic_card(at, controller) {
        let local_langsel = new LanguageSelector();

        let theobox = document.createElement("div");
        theobox.className = 'theorem-card';
        let theodesc = document.createElement("div");
        theodesc.className = 'math-content';

        theodesc.textContent = at.text[`${local_langsel.current_language.language_name}`];
        document.getElementById("available_tactics").appendChild(theobox);

        let header = document.createElement('div');
        header.className = "math-header theorem-header";
        header.textContent = at.name;

        let tboxes = []

        for (let i = 0; i < at.n_params; i++){
            let tbox = document.createElement("INPUT");
            tbox.setAttribute("type", "text");
            tboxes.push(tbox);
        }

        let apply_button = document.createElement("button");
        apply_button.className = "button-4";
        apply_button.textContent = local_langsel.current_language.APPLY;
        apply_button.onclick = () => {
            
            let args = tboxes.map(x => {return x.value});
            controller.apply_tactic(at.coq, args)
        };


        theobox.appendChild(header);
        theobox.appendChild(theodesc);
        for (let tbox of tboxes) {
            theobox.appendChild(tbox);
        }
        theobox.appendChild(apply_button);
        MathJax.typeset();
    }
    
    add_hp_application_card (controller) {

        let local_langsel = new LanguageSelector();

        let hypbox = document.createElement("div");
        hypbox.className = 'theorem-card';
        let theodesc = document.createElement("div");
        theodesc.className = 'math-content';
        theodesc.textContent = `${local_langsel.current_language.CHOOSEHYP}:`;
        document.getElementById("hypman").appendChild(hypbox);

        let header = document.createElement('div');
        header.className = "math-header hypothesis-header";
        header.textContent = local_langsel.current_language.APPLYHYP;
        
        let tbox = document.createElement("INPUT");
        tbox.setAttribute("type", "text");
        
        
        let rw_lr = document.createElement("button");
        rw_lr.className = "button-4";
        rw_lr.textContent = `${local_langsel.current_language.APPLY} (🡒)`;
        rw_lr.onclick = () => {controller.rewrite_theorem(tbox.value, true)};

        let rw_rl = document.createElement("button");
        rw_rl.className = "button-4";
        rw_rl.onclick = () => {controller.rewrite_theorem(tbox.value, false)};
        rw_rl.textContent = `${local_langsel.current_language.APPLY} (🡐)`;
        
        hypbox.appendChild(header);
        hypbox.appendChild(theodesc);
        hypbox.appendChild(tbox);
        hypbox.appendChild(rw_lr);
        hypbox.appendChild(rw_rl);
        MathJax.typeset();
    }
        
        
    
    add_hp_handlers(controller) {
        this.add_hp_application_card(controller)
        
        
        // TODO Rewrite Hypothesis within Other Hypothesis
    }
}

export { Visualizer };
