import {LanguageSelector} from "./multilang.js"

class Hinter {
    constructor(controller){
        this.controller = controller
        this.observer = controller.observer
        this.langsel = new LanguageSelector();
    }
    
    give_hints() {
        let res = []
        let cur_goal = this.observer.current_goal.goal;
        
        {/* HINT FORALL */
            let m = cur_goal.match(/^forall ([a-zA-Z0-9]+)/);
            console.log("HINT".repeat(10))
            console.log(m)
            if (m) {
                res.push ({
                    name : `${this.langsel.current_language.HINT}: ${this.langsel.current_language.CHOOSEARBITRARY} ${m[1]} (Intro)`,
                    func : () => {
                        this.controller.apply_tactic("intro.");
                    }
                });
            }
        }
        
        {/* HINT FORALL with paren */
            let m = cur_goal.match(/^forall\s*\(([a-zA-Z0-9]+)/);
            console.log("HINT".repeat(10))
            console.log(m)
            if (m) {
                res.push ({
                    name : `${this.langsel.current_language.HINT}: ${this.langsel.current_language.CHOOSEARBITRARY} ${m[1]} (Intro)`,
                    func : () => {
                        this.controller.apply_tactic("intro.");
                    }
                });
            }
        }
        
        {/* HINT SYMMETRY */
            if(cur_goal.includes("=")){
                let s = cur_goal.split("=").map(x => x.trim())
                if (s[0] == s[1]){
                    res.push ({
                    name : `${this.langsel.current_language.HINT}: ${this.langsel.current_language.APPLYREFLEXIVITY} (Reflexivity)`,
                    func : () => {
                        this.controller.apply_tactic("reflexivity.");
                    }
                });
                }
                else{
                 console.log("different: ", s[0], s[1])   
                }
            }
        }
        
        return res;
    }
    
}


export { Hinter };
