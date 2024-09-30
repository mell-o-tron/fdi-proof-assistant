class PlainTextifier {
    constructor() {
        this.replacements = [
            ["forall", "\\forall"],
            ["exists", "\\exists"],
            ["->", "\\to"],
            ["nat", "\\mathbb N"],
            [",", "\\;.\\;"],
            ["→", "\\to"],
            ["ℕ", "\\mathbb N"],
            ["∀", "\\forall"],
            ["°", ","],
        ];
    }

    goal_to_plain_text(goal) {
        console.log("AAAAAAA");
        console.log(goal.conc);
        let res = "";

        if (goal.hyp.length === 0) {
            res = "Show that:";
            res += this.centered_math(this.plain_textify(goal.conc));
            res += "\n";
            return res;
        } else {
            res = "Assuming: ";
            for (let hp of goal.hyp) {
                res += this.centered_math(this.latexise(this.textify_hp(hp))) + "\n";
            }
            res += "prove that ";
            res += this.inline_math(this.latexise(this.plain_textify(goal.conc))) + ".";
            return res;
        }
    }

    theorem_to_plain_text(theo_text, theo_type) {
        let text = theo_text.replace(theo_type, "");
        let theo_name = text.substring(0, text.indexOf(":"));
        text = text.substring(text.indexOf(":") + 1, text.length - 1);

        return `(${this.inline_math("\\texttt{" + theo_name.trim() + "}")}) : ${this.inline_math(this.latexise(text))}`;
    }

    latexise(text) {
        let res = text;
        for (let r of this.replacements) {
            res = res.replaceAll(r[0], r[1]);
        }
        return res;
    }

    inline_math(t) {
        return `\\(${t}\\)`;
    }

    centered_math(t) {
        return `\\[${t}\\]`;
    }

    textify_hp(hp) {
        let hp_name = "";
        let res = "";
        for (let c of hp) {
            if (c.type === "hp_name" && hp_name === "")
                hp_name = c.value;
            else if (c.type === "hp_name")
                hp_name += "° " + c.value;
            else
                res += c.value;
        }
        return `\\texttt{${hp_name}} : ${res}`;
    }

    plain_textify(parsed_list) {
        let res = "";
        for (let v of parsed_list) {
            res += v.value;
        }
        return res;
    }
}

export {PlainTextifier};
