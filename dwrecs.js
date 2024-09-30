import { JsCoq } from './node_modules/jscoq/jscoq.js';
import {parse_goal} from "./src/goal_parser.js"
import {goal_to_plain_text} from "./src/to_plain_text.js"
import {add_line, go_next_n, go_prev_n} from "./src/coq_controls.js"


var jscoq_ids  = ['coq-code'];
var jscoq_opts = {
prelude:   true,
implicit_libs: true,
editor:{ mode: { 'company-coq': true }, keyMap: 'default' },
init_pkgs: ['init'],
all_pkgs:  ['coq']
};

let manager_promise = JsCoq.start(jscoq_ids, jscoq_opts);


manager_promise.then(function(manager) {
  
  manager.when_ready.then(function (result){
    
    console.log("COQ READY")
    console.log(manager.coq.query(1, 0, ['Mode']));
    
    let snippet = manager.provider.snippets[0]
    console.log(snippet)
    add_line("Lemma thing : forall (x : nat), 2 * x = x + x.\nProof.", snippet)
    
    manager.provider.focus();
    go_next_n(manager, 2, () => {
      let a = manager.layout.proof;
      console.log(a);
      console.log(a.outerText);
      // console.log(manager.doc.sentences)
      add_line('induction x.', snippet);
      add_line('rewrite <- plus_n_O.', snippet);
      add_line('rewrite <- mult_n_O.', snippet);
      add_line('reflexivity.', snippet);
      
//       add_line('reflexivity.', snippet);
      go_next_n(manager, 4, () => {}, () => {})
      
      
//       go_next_n(manager, 6, () => {}, () => {})
      
//       manager.reset().then(() => {console.log("banana")})
      
//       go_next_n(manager, 6, () => {}, () => {})
    }, () => {
      console.log("There was an error with the proof")
    });

  });
});
