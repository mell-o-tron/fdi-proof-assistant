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
        let m = cur_goal.match(/^forall (\w)/);
        console.log("HINT".repeat(10))
        console.log(m)
        if (m) {
            res.push ({
                name : `${this.langsel.current_language.CHOOSEARBITRARY} ${m[1]}`,
                func : () => {
                    this.controller.apply_tactic("intro.\n");
                }
            });
        }
        return res;
    }
    
}


export { Hinter };
