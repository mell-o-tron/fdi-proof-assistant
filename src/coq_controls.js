import {Visualizer} from "./visualizer.js"

class Controller {
  constructor(manager, snippet){
    this.manager = manager;
    this.snippet = snippet;
    this.visualizer = new Visualizer();
    this.available_theorems = [];
  }


  /* writes a new coq line to the editor */
  add_line (line_text) {
      let cursor = this.snippet.editor.getCursor()
      console.log(cursor)
      var line = this.snippet.editor.getLine(cursor.line);
      var pos = {
          line: cursor.line,
          ch: line.length
      }
      this.snippet.editor.replaceRange("\n" + line_text, pos);
  }
  
  rm_line () {
      this.snippet.editor.replaceRange("", { line: this.snippet.editor.getCursor().line, ch: 0 }, { line: this.snippet.editor.getCursor().line + 1, ch: 0 });
//       this.snippet.editor.execCommand("deleteLine");
  }

  /* waits for sentence to reach processed (or error) state - TODO add param to error */
  wait_for_processed(sentence, cont, on_err, depth = 0){
  //   console.log("==================== WFP")
  //   console.log(sentence)
  //   console.log(cont)
  //   console.log(depth)
  //   console.log("====================")

    if (sentence.phase != "processed" && sentence.phase != "error"){
      setTimeout(this.wait_for_processed.bind(this), 100, sentence, cont, on_err, depth + 1)
    }
    else if (sentence.phase == "processed"){
      cont()
    }
    else {
      on_err()
    }
  }

  /* waits for sentence to reach cancelling state - probly not needed. */
  wait_for_cancelled(sentence, cont, on_err, depth = 0){
  //   console.log("==================== WFC")
  //   console.log(sentence.phase)
  //   console.log(cont)
  //   console.log(depth)
  //   console.log("====================")

    if (sentence.phase != "cancelling" && sentence.phase != "error"){
      setTimeout(this.wait_for_cancelled.bind(this), 100, sentence, cont, on_err, depth + 1)
    }
    else if (sentence.phase == "cancelling"){
      cont()
    }
    else {
      on_err()
    }
  }

  /* evaluates n lines of coq */
  go_next_n(n, should_vis, cont, err){
    if (n == 0) {
      cont()
    }
    else{
      this.manager.goNext(true)
      let stmt = this.manager.doc.sentences.slice(-1)[0];
      this.wait_for_processed(stmt, () => {
  //       console.log("PROCESSED:")
  //       console.log(stmt)
        this.go_next_n(n-1, should_vis, cont, err);
        if (should_vis) this.visualizer.visualize(stmt);
      }, err)
    }
  }

  /* un-evaluates n lines of coq */
  go_prev_n(n){
    if (n == 0) {
      return;
    }
    else{
      this.manager.goPrev(true)
      this.go_prev_n(n-1)
    }
  }
  
  rewrite_theorem(theo_name, direction){
    this.add_line(`rewrite ${direction?"->":"<-"} ${theo_name}.`, this.snippet);
    this.go_next_n(1, true, () => {
      let div = document.getElementById("scroooool");
      console.log("that div is: " + div);
//       div.scrollTop = div.scrollHeight;  //TODO fix this
      
    }, () => {this.go_prev_n(1); alert("Cannot apply theorem"); this.rm_line()});
  
  }
}

export {Controller}
