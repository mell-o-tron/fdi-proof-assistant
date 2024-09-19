function goal_to_plain_text (goal){
    console.log("AAAAAAA")
    console.log(goal.conc)

    if (goal.hyp.length == 0){
        res += "Show that "
        res += inline_math(plain_textify(goal.conc))
        res += ".\n"
    }
    else{

        let res = "Assuming that "
        for (let hp of goal.hyp){
            res += inline_math(textify_hp(hp)) + ", "
        }
        res += "prove that "
        res += inline_math(plain_textify(goal.conc))

        return res
    }
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
    return res
}

function plain_textify (parsed_list){
    let res = ""

    for (let v of parsed_list){
        res += v.value
    }
    return res
}

export {goal_to_plain_text}
