import { JsCoq } from './node_modules/jscoq/jscoq.js';

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
    console.log("READYYYYYYYYYYYYYYYYYYYYYYYY")
    let snippet = manager.provider.getSnippets()[0]
    console.log(snippet)
    snippet.injectText("Let x := 5.\nPrint x.\n")
    
    manager.provider.focus();
    manager.goNext(true)
    manager.goNext(true)
  });


});
