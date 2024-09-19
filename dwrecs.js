import { JsCoq } from './node_modules/jscoq/jscoq.js';
import {parse_goal} from "./src/goal_parser.js"
import {goal_to_plain_text} from "./src/to_plain_text.js"

function wait_for_processed(sentence, cont, on_err, depth = 0){
  console.log("====================")
  console.log(sentence)
  console.log(cont)
  console.log(depth)
  console.log("====================")

  if (sentence.phase != "processed" && sentence.phase != "error"){
    setTimeout(wait_for_processed, 100, sentence, cont, on_err, depth + 1)
  }
  else if (sentence.phase == "processed"){
    cont()
  }
  else {
    on_err()
  }
}

function go_next_n(manager, n, cont, err){
  if (n == 0) {
    cont()
  }
  else{
    manager.goNext(true)
    wait_for_processed(manager.doc.sentences.slice(-1)[0], () => {
      go_next_n(manager, n-1, cont, err)
    }, err)
  }
}



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
    let snippet = manager.provider.getSnippets()[0]
    console.log(snippet)
    snippet.injectText("Lemma thing : forall (x : nat), forall (y : nat) , x = x -> x = y.\nProof.\ninduction x.\ninduction y.\nintros.")
    
    manager.provider.focus();
    go_next_n(manager, 6, () => {
      console.log(manager.doc.sentences.slice(-1)[0].phase)
      let a = manager.layout.proof;
      console.log(a);
      console.log(a.outerText);
      // console.log(manager.doc.sentences)

      console.log(parse_goal(a))
      console.log(goal_to_plain_text(parse_goal(a)))
    }, () => {
      console.log("There was an error with the proof")
    });

  });
});
