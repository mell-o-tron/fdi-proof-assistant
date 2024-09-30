import {visualize} from "./visualizer.js"


/* writes a new coq line to the editor */
function add_line (line_text, snippet) {
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
function wait_for_processed(sentence, cont, on_err, depth = 0){
//   console.log("==================== WFP")
//   console.log(sentence)
//   console.log(cont)
//   console.log(depth)
//   console.log("====================")

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

/* waits for sentence to reach cancelling state - probly not needed. */
function wait_for_cancelled(sentence, cont, on_err, depth = 0){
//   console.log("==================== WFC")
//   console.log(sentence.phase)
//   console.log(cont)
//   console.log(depth)
//   console.log("====================")

  if (sentence.phase != "cancelling" && sentence.phase != "error"){
    setTimeout(wait_for_cancelled, 100, sentence, cont, on_err, depth + 1)
  }
  else if (sentence.phase == "cancelling"){
    cont()
  }
  else {
    on_err()
  }
}

/* evaluates n lines of coq */
function go_next_n(manager, n, cont, err){
  if (n == 0) {
    cont()
  }
  else{
    manager.goNext(true)
    let stmt = manager.doc.sentences.slice(-1)[0];
    wait_for_processed(stmt, () => {
//       console.log("PROCESSED:")
//       console.log(stmt)
      go_next_n(manager, n-1, cont, err)
      visualize(stmt)
    }, err)
  }
}

/* un-evaluates n lines of coq */
function go_prev_n(manager, n, cont, err){
  if (n == 0) {
    cont()
  }
  else{
    manager.goPrev(true)
    wait_for_cancelled(manager.doc.sentences.slice(-1)[0], () => {
      go_prev_n(manager, n-1, cont, err)
    }, err)
  }
}


export {add_line, go_next_n, go_prev_n}
