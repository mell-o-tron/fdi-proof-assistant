import { JsCoq } from './node_modules/jscoq/jscoq.js';
import {Controller} from "./src/coq_controls.js"
import {LanguageSelector} from "./src/multilang.js"
import {Observer} from "./src/coq_observer.js"
import {Currifier} from "./src/currifier.js"
import {TeXifier} from "./src/texifier.js"

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


window.addEventListener("unhandledrejection", (event) => {console.log(event)});


async function createTopicJson(summaryJson) {
    let definitions = [];
    let theorems = await Promise.all(summaryJson.theorems.map(x => readJsonFile(`./topics/theorems/${x}`)));
    for (let d of summaryJson.definitions) {
      let x = await readJsonFile(`./topics/definitions/${d}`)
      definitions.push(x.definition)
      theorems = theorems.concat(x?.theorems)
    }
    let extra = await Promise.all(summaryJson.extra.map(x => readJsonFile(`./topics/extra/${x}`)));
    let tactics = await Promise.all(summaryJson.tactics.map(x => readJsonFile(`./topics/tactics/${x}`)));
    return {extra, definitions, theorems, tactics}
}

function loading_set_number_daemon (manager) {
  console.log("DAEMON")
  let loading = document.getElementById("loading");
  if(loading.style.display != "none") {
    loading.innerHTML = `<h1>Loading...</h1>(${manager.doc.sentences.length} lines loaded)`
    setTimeout(loading_set_number_daemon, 100, manager);
  }
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const name = urlParams.get('theorem_name');
const topic = urlParams.get('theorem_topic');
const language = urlParams.get('language') ? urlParams.get('language') : "english";
let history = urlParams.get('history');


// set up jscoq
var jscoq_ids  = ['coq-code'];
var jscoq_opts = {
prelude:   true,
implicit_libs: true,
editor:{ mode: { 'company-coq': true }, keyMap: 'default' },
init_pkgs: ['init'],
all_pkgs:  ['coq'],
backend: 'wa'
};


let language_selector = new LanguageSelector();


// Language Selection
const selectDropdown = document.getElementById('langs');

selectDropdown.value = language;
selectDropdown.addEventListener('change', function (e) {
  console.log(selectDropdown.value) 
                
  let url = new URL(window.location.href);
  url.searchParams.set("language", `${selectDropdown.value}`);

window.location.href = url.toString();
});


async function initialize_system (){

  try {
    await language_selector.select_language(language.trim());

    let theorem_creator = document.getElementById("theorem_creator");


    let proof_obj = {};
    let topic_obj = {};

    if (!theorem_creator) {
      proof_obj = await readJsonFile(`./theorems/${name}.json`);
      topic_obj = await readJsonFile(`./topics/topic_summaries/${topic}.json`);
      topic_obj = await createTopicJson(topic_obj);
    } else {
      let definition_select = document.getElementById("definition_select");
      let theorem_select = document.getElementById("theorem_select");
      let tactic_select = document.getElementById("tactic_select");
      let extra_select = document.getElementById("extra_select");

      let theorem_input = document.getElementById("theorem_input");

      
      topic_obj = {definitions:  [...definition_select.multiselect.selectedValues],
                   theorems:     [...theorem_select.multiselect.selectedValues],
                   tactics:      [...tactic_select.multiselect.selectedValues],
                   extra:        [...extra_select.multiselect.selectedValues]
      }
      
      topic_obj = await createTopicJson(topic_obj);
      
      // NOTE bad hack, passes fake controller...
      
      let fake_controller = {definitions : topic_obj.definitions};
      
      let theorem_coq = "Theorem t : " + (new Currifier(fake_controller)).currify(theorem_input.value) + ".";
      
      console.log("THEOREM_COQ", theorem_coq);
      
      proof_obj = {theorem: {text:{english : "Custom Theorem: " + (new TeXifier).texify(theorem_input.value), italiano : "Teorema Custom: " + (new TeXifier).texify(theorem_input.value)}, coq: theorem_coq}, definitions : []}

    }

    

    console.log("PROOF OBJECT", proof_obj);
    console.log("TOPIC OBJECT", topic_obj);

    if (proof_obj == null || topic_obj == null){
        throw new Error ("proof environment is invalid");
    }
    else {
      // returns the coq manager
      let manager_promise = JsCoq.start(jscoq_ids, jscoq_opts);

      let manager = await (manager_promise)

      loading_set_number_daemon(manager);

      // waits for coq to be ready
      let result = await(manager.when_ready);

      let coq_observer = new Observer();
      manager.coq.observers.push(coq_observer);

      console.log("COQ READY")
      console.log(manager.coq.query(1, 0, ['Mode']));

      // gathers the current code snippet - this is used for manipulating the code (e.g. adding lines).
      let snippet = manager.provider.snippets[0]

      console.log(language_selector);

      let controller = new Controller(manager, snippet, coq_observer, language_selector);

      // add history to selectDropdown
      selectDropdown.addEventListener('change', function (e) {
        console.log(selectDropdown.value)
        let url = new URL(window.location.href);
        url.searchParams.set("language", `${selectDropdown.value}`);
               url.searchParams.set("history", `${controller.coq_history.join("")}`);
        window.location.href = url.toString();
      });
      controller.set_definitions(topic_obj.definitions);
      // adds definitions and theorem to coq code
      let str = "";
      for (let e of topic_obj.extra) {
        str += e.coq + "\n";
      }
      for (let d of topic_obj.definitions) {
        str += d.coq + "\n";
      }
      // adds theorems to the controller's available theorem list
      for (let d of topic_obj.theorems) {
        str += d.coq + "\n";
      }
      // adds tactics to the controller's available tactics list
      for (let t of topic_obj.tactics) {
        controller.available_tactics.push(t);
      }
      for (let d of proof_obj.definitions) {
        str += d.coq + "\n";
      }
      str += proof_obj.theorem.coq + "\nProof.\n";
      console.log(proof_obj.theorem);
      controller.add_line(str);
      controller.go_next_n(str.split("\n").length, false, () => {
        for (let d of topic_obj.definitions) {
          controller.visualizer.visualize_math(d, "definition", controller);
        }
        for (let d of topic_obj.theorems) {
          controller.available_theorems.push(d);
        }
        for (let d of proof_obj.definitions) {
          controller.visualizer.visualize_math(d, "definition", controller);
        }
        controller.visualizer.visualize_math(proof_obj.theorem, "theorem", controller);
        // Add the available theorems to the menu on the right
        for (let at of controller.available_theorems){
          if (at.name.endsWith("base_clause") || at.name.endsWith("inductive_clause")){
            controller.visualizer.add_theo_card(at, controller, "available_definitions");
          } else {
            controller.visualizer.add_theo_card(at, controller);
          }
        }
        // Add the available tactics to the menu on the right
        for (let tac of controller.available_tactics){
          controller.visualizer.add_tactic_card(tac, controller)
        }
        controller.visualizer.add_hp_handlers(controller)
        document.getElementById("loading").style.display = "none";
        // TODO IMPLEMENT REPLAY OF HISTORY WHEN CHANGE LANGUAGE
      }, () => {
        alert("There is a mistake in the definitions or theorem statement.")
        console.log("There is a mistake in the definitions or theorem statement.")
      });

    }

  } catch (error) {
    alert("Error Occurred: " + error)
    console.log("Error Occurred: " + error)
  }

}

let theorem_creator = document.getElementById("theorem_creator");

if (!theorem_creator)
  initialize_system();
else {
  console.log("banana")
  let start_proof_button = document.getElementById("start_proof");
  console.log(start_proof_button)
  start_proof_button.onclick = () => {
    document.getElementById("loading").style.display = "block";
    initialize_system()
    theorem_creator.style.display = "none";
  }
}


