
import { FormatPrettyPrint } from '../node_modules/jscoq/jscoq.js';

// Observer class: gathers current goal and receives goal display function

class Observer {
  constructor() {
    this.when_ready = new Promise(resolve => this._ready = resolve);
    this.pprint = new FormatPrettyPrint();
    this.current_goal = {};
    this.vis_fun = (() => {});
    this.has_goals = false;   // used to check if proof is finished.
  }
  coqReady() {  this._ready(); }
  coqGoalInfo(sid, goals) {
    if (!goals) {
      console.log("There are no current goals")
      this.has_goals = false;
      return
    }
    if (!goals.goals) {
      this.has_goals = false;
      console.log("There are no current goals")
      return
    }
    var bar = `\n${"-".repeat(60)}\n`
    console.log(`current goals:`);
    console.log(bar, goals, bar);
    
    if (goals.goals[0]) {
      this.has_goals = true;
      let g = goals.goals[0]
      
      this.current_goal.hypotheses = []
      for (let h of g.hyp) {
        let hp_name = h[0][0][1]
        let hp_body = this.pprint.pp2Text(h[2])
        this.current_goal.hypotheses.push({name: hp_name, body: hp_body})
      }
      
      const dropdowns = document.querySelectorAll(".hyp-dropdown");
      
      dropdowns.forEach(dropdown => {
        dropdown.innerHTML = "";
        
        for (let h of this.current_goal.hypotheses){
          let hopt = document.createElement('option');
          hopt.value = h.name;
          hopt.textContent = h.name;
          dropdown.appendChild(hopt);
        }
        
      });
        
      this.current_goal.goal = this.pprint.pp2Text(g.ty)
    } else {
     this.has_goals = false; 
    }
    this.vis_fun();
    
    console.log(this.current_goal);
  }
} 

export {Observer}
