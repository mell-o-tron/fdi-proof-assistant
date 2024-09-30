function goal_to_plain_text (goal){
    console.log("AAAAAAA")
    console.log(goal.conc)
    let res = ""
    if (goal.hyp.length == 0){
        res = "Show that:"
        res += centered_math(plain_textify(goal.conc))
        res += "\n"
        return res;
    }
    else{

        res = "Assuming: "
        for (let hp of goal.hyp){
            res += centered_math(latexise(textify_hp(hp))) + "\n"
        }
        res += "prove that "
        res += inline_math(latexise(plain_textify(goal.conc))) + "."
        
        return res
    }
}

// Lemma thing : forall (x : nat), forall (y : nat) , x = x -> x = y.
function theorem_to_plain_text(theo_text, theo_type){
    let text = theo_text.replace(theo_type, "")
    let theo_name = text.substring(0, text.indexOf(":"))
    text = text.substring(text.indexOf(":") + 1, text.length - 1)
    
    return `(${inline_math("\\texttt{" + theo_name.trim() + "}")}) : ${inline_math(latexise(text))}`
    
}

function latexise (text){
    let res = text
    /* WARNING ORDER MATTERS! FIRST NON-PRETTYPRINTED */
    
    let replacements = [["forall", "\\forall"], 
                        ["exists", "\\exists"], 
                        ["->", "\\to"], 
                        ["nat", "\\mathbb N"], 
                        [",", "\\;.\\;"], 
                        ["→", "\\to"], 
                        ["ℕ", "\\mathbb N"], 
                        ["∀", "\\forall"], 
                        ["°", ","],
                       ]
    
    for (let r of replacements){
        res = res.replaceAll(r[0], r[1])
    }
    return res
}

let inline_math = (t) => `\\(${t}\\)`
let centered_math = (t) => `\\[${t}\\]`

function textify_hp (hp){
    let hp_name = ""
    let res = ""
    for (let c of hp) {
        if (c.type == "hp_name" && hp_name == "")
            hp_name = c.value
        else if (c.type == "hp_name")
            hp_name += "° " + c.value
        else
            res += c.value
    }
    return `\\texttt{${hp_name}} : ${res}`
}

function plain_textify (parsed_list){
    let res = ""

    for (let v of parsed_list){
        res += v.value
    }
    return res
}

export {goal_to_plain_text, theorem_to_plain_text, inline_math, centered_math}
