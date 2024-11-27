function end_or_first_unmatched_rpar (s, i) {
    let j = i;
    
    let nesting_level = 1;
    
    while (j < s.length && nesting_level >= 1) {
        let c = s[j];
        if (c == "("){
            nesting_level ++;
        } else if(c == ")"){
            nesting_level --;
        }
        
        j++;
    }
    
    return j-1;
    
}


function find_zero_depth_equals (s) {
    let j = 0;
    let depth = 0;
    let equal_signs = []
    while (j < s.length) {
        if (s[j] == "(") depth ++;
        if (s[j] == ")") depth --;
        if (s[j-1] != "=" && s[j] == "=" && s[j+1] != "=" && depth == 0) equal_signs.push(j);
        j++;
    }
    return equal_signs;
}

function find_matching_paren (s, i) {
    let j = i;
    let depth = 1;
    while (j < s.length - 1 && depth != 0) {
        j++;
        if (s[j] == "(") depth ++;
        if (s[j] == ")") depth --;
    }
    if (depth == 0) return j;
    else return null;
}


class TeXifier {
    constructor() {
        this.replacements = [
            ["forall", "\\forall"],
            ["exists", "\\exists"],
            ["->", "\\to"],
            [" nat", " \\mathbb{N}"],
//            ["N", "\\mathbb{N}"],
            [",", " ."],
            ["→", "\\to"],
            ["ℕ", "\\mathbb{N}"],
            ["list", "L"],
            ["bte", "BT"],
            ["nterm", "\\mathcal{N}Term"],
            ["false", "\\texttt{false}"],
            ["true", "\\texttt{true}"],
            ["||", "\\vee"],
            ["lmd", "\\lambda"],
//             [" ", "\\;"],
            ["∀", "\\forall"],
            ["§", ","]
        ];
    }

    
    texify_common(text){
       
        // visualizing ifs
        let res = text;
        
        res = res.replaceAll("#cases", "\\begin{cases} ")
                 .replaceAll("#if", "& \\text{if }")
                 .replaceAll("#otherwise", "\\\\")
                 .replaceAll("#endcases", "& \\text{otherwise}\\end{cases}");
                 
        

        // visualizing exponents

        res = res.replaceAll("#^", "^{").replaceAll("^#", "}");

        
        
        for (let r of this.replacements) {
            res = res.replaceAll(r[0], r[1]);
        }

        // regex to replace generic types with subtext, e.g. L \mathbb{N} -> L_\mathbb{N}
        res = res.replaceAll(/( [a-zA-Z]+) (\\*[a-zA-Z{}]+)/g, "$1_{$2}");

        res = res.replaceAll(/^(?<=\\)([a-zA-Z0-9]) ([a-zA-Z0-9])/g, "$1\\;$2")
        res = res.replaceAll(/([\s\(;][a-zA-Z])([0-9]+)/g, "$1_{$2}")
        
        
        // TODO recognize stuff of form X == Y and put it into parens
        
        return res
    }
    
    texify(text) {
        let res = this.texify_common(text);
        
        return `<div class="scroll-equation">` + this.centered_math(res) + `</div>`;
    }
    
    texify_inline(text) { 
        let res = this.texify_common(text);
        
        return this.inline_math(res);
    }

    inline_math(t) {
        return `\\(${t}\\)`;
    }

    centered_math(t) {
        return `\\[${t}\\]`;
    }

}

export {TeXifier};
