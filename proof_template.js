import { JsCoq } from './node_modules/jscoq/jscoq.js';
import {Controller} from "./src/coq_controls.js"


async function readJsonFile(url) {
    try {
        // Fetch the JSON file
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data
        const jsonData = await response.json();

        // Return the parsed data
        return jsonData;

    } catch (err) {
        console.error("Error fetching or parsing the file:", err);
        return null; // Return null in case of an error
    }
}



// set up jscoq
var jscoq_ids  = ['coq-code'];
var jscoq_opts = {
prelude:   true,
implicit_libs: true,
editor:{ mode: { 'company-coq': true }, keyMap: 'default' },
init_pkgs: ['init'],
all_pkgs:  ['coq']
};



const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const name = urlParams.get('theorem_name');
const topic = urlParams.get('theorem_topic');

readJsonFile(`./theorems/${name}.json`).then(function (proof_obj) {
  readJsonFile(`./topics/${topic}.json`).then(function (topic_obj) {
  
    console.log(proof_obj);
    console.log(topic_obj);
    
    if (proof_obj == null || topic_obj == null){
        throw new Error ("proof environment is invalid");
    }
    else {
      // returns the coq manager
      let manager_promise = JsCoq.start(jscoq_ids, jscoq_opts);

      manager_promise.then(function(manager) {

        // waits for coq to be ready
        manager.when_ready.then(function (result){
              
          let controller = new Controller(manager);

          console.log("COQ READY")
          console.log(manager.coq.query(1, 0, ['Mode']));
          
          // gathers the current code snippet - this is used for manipulating the code (e.g. adding lines).
          let snippet = manager.provider.snippets[0]
          
          
          // adds definitions and theorem to coq code
          let str = "";
          
          for (let d of topic_obj.definitions) {
            str += d.coq + "\n";
            controller.visualizer.visualize_math(d, "definition");
          }
          
          for (let d of topic_obj.theorems) {
            str += d.coq + "\n";
            controller.available_theorems.push(d);
          }
          
          for (let d of proof_obj.definitions) {
            str += d.coq + "\n";
            controller.visualizer.visualize_math(d, "definition");
          }
          
          str += proof_obj.theorem.coq + "\nProof.\n";
          
          controller.visualizer.visualize_math(proof_obj.theorem, "theorem");
          controller.add_line(str, snippet);
          
          for (let at of controller.available_theorems){ 
            let theobox = document.createElement("div");
            let theodesc = document.createElement("div");
            theodesc.textContent = at.text;
            theobox.appendChild(theodesc);
            document.getElementById("available_theorems").appendChild(theobox);
            MathJax.typeset();
          }
          
          controller.go_next_n(str.split("\n").length, false, () => {
            controller.add_line("induction n.\nintro.", snippet);
            controller.go_next_n(2, true, () => {
              
            }, () => {
              console.log("There is a mistake in the proof.")
            });
            
            
          }, () => {
            console.log("There is a mistake in the definitions or theorem statement.")
          });
          
          
          
          /*console.log(snippet)
          controller.add_line("Lemma thing : forall (x : nat), 2 * x = x + x.\nProof.", snippet)
          
          manager.provider.focus();
          controller.go_next_n(2, true, () => {
            let a = manager.layout.proof;
            console.log(a);
            console.log(a.outerText);
            controller.add_line('induction x.', snippet);
            controller.add_line('rewrite <- plus_n_O.', snippet);
            controller.add_line('rewrite <- mult_n_O.', snippet);
            controller.add_line('reflexivity.', snippet);
            
            controller.go_next_n(4, true, () => {}, () => {})

          }, () => {
            console.log("There was an error with the proof")
          });*/

        });
      });
    }
    
  }).catch(err => console.error("Error occurred while fetching or processing the JSON data:", err));
}).catch(err => console.error("Error occurred while fetching or processing the JSON data:", err));



