function parse_goal(goal_html){
    let res = {hyp : [], conc : {}, pending : []}

    let html = goal_html.firstChild

    let num_goals = html.children[0].textContent
    let env = html.children[1]

    for (let c of env.children){
        if (c.className == "coq-hypothesis"){
            res.hyp.push(parse_with_label(c, "hp_name"));
        }
    }
    let conc_index = env.children.length - 1;
    if (env.children[conc_index].className == "Pp_box")
        res.conc = parse_ppbox_stupid(env.children[conc_index]);
    else
        res.conc = [{type: env.children[conc_index].className, value : env.children[conc_index].textContent}]

    for (let i in html.children){
        console.log(html.children[i].className)
        if(i > 1){
            res.pending.push(parse_with_label(html.children[i], "goal_name"))
        }
    }
   return res;
}

function parse_with_label(hyp_html, label_value){
    let result = []
    for (let c of hyp_html.children) {
        if (c.nodeName == "LABEL")
            result.push({type: label_value, value: c.textContent})

        if (c.nodeName == "DIV"){
            for (let cc of c.children){
                if (cc.className == "Pp_box"){
                    result = result.concat(parse_ppbox_stupid(cc))
                }
                else if (cc.className != "Pp_break"){
                    result.push({type: cc.className, value: c.textContent})
                }
            }
        }
    }
    
    console.log("BANANA")
    console.log(result)
    return result;
}

function parse_ppbox_stupid(pp_html){
    return [{type: "stupid_pp", value: pp_html.textContent}];
}

function parse_ppbox(pp_html){
    let result = []
    for (let c of pp_html.children) {
        if (c.className != "Pp_break" && c.className != "Pp_box"){
            result.push({type : c.className, value: c.textContent})
        }
        else if (c.className == "Pp_box")
            result = result.concat(parse_ppbox(c))
    }
    return result;
}

export {parse_goal}
