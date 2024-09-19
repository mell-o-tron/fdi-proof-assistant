function goal_to_plain_text (goal){
    console.log("AAAAAAA")
    console.log(goal.conc)
    let res = ""
    if (goal.hyp.length == 0){
        res = "Show that "
        res += inline_math(plain_textify(goal.conc))
        res += ".\n"
    }
    else{

        res = "Assuming: "
        for (let hp of goal.hyp){
            res += centered_math(textify_hp(hp)) + "\n"
        }
        res += "prove that "
        res += inline_math(plain_textify(goal.conc)) + "."
        
        return latexise(res)
    }
}

function latexise (text){
    let res = text
    let replacements = [["→", "\\implies"], ["ℕ", "\\mathbb N"], ["∀", "\\forall"]]
    
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
        if (c.type == "hp_name")
            hp_name = c.value
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

export {goal_to_plain_text}
