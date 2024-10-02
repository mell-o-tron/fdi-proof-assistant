import {Visualizer} from "./visualizer.js"

class Controller {
  constructor(manager){
    this.manager = manager
    this.visualizer = new Visualizer();
    this.available_theorems = [];
  }


  /* writes a new coq line to the editor */
  add_line (line_text, snippet) {
      let cursor = snippet.editor.getCursor()
      console.log(cursor)
      var line = snippet.editor.getLine(cursor.line);
      var pos = {
          line: cursor.line,
          ch: line.length
      }
      snippet.editor.replaceRange("\n" + line_text, pos);
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
  go_prev_n(n, cont, err){
    if (n == 0) {
      cont()
    }
    else{
      this.manager.goPrev(true)
      this.wait_for_cancelled(this.manager.doc.sentences.slice(-1)[0], () => {
        this.go_prev_n(n-1, cont, err)
      }, err)
    }
  }
}

export {Controller}
