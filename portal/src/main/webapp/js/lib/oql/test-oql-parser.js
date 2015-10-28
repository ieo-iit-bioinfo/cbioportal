parser = require("./oql-parser.js");

var testAlterationEquality = function(expected, given) {
	try {
		for (var i = 0; i < expected.length; i++) {
			var exp_alt = expected[i];
			var giv_alt = given[i];

			var same_keys = true;
			var same_values = true;
			for (var key in exp_alt) {
				if (exp_alt.hasOwnProperty(key)) {
					same_keys = same_keys && giv_alt.hasOwnProperty(key);
					same_values = same_values && (giv_alt[key] === exp_alt[key]);
				}
			}
			for (var key in giv_alt) {
				if (giv_alt.hasOwnProperty(key)) {
					same_keys = same_keys && exp_alt.hasOwnProperty(key);
				}
			}
			if (!same_keys || !same_values) {
				return false;
			}
		}	
		return true;
	} catch (err) {
		return false;
	}
};

var testCmd = function(cmd, expected) {
	try {
		var given = parser.parse(cmd);
		for (var i = 0; i < expected.length; i++) {
			if (!(expected[i].gene === given[i].gene && testAlterationEquality(expected[i].alterations, given[i].alterations))) {
				return false;
			}
		}	
		return true;
	} catch (err) {
		return false;
	}
};

var failed_a_test = false;

var doTest = function(cmd, expected) {
	if (!testCmd(cmd, expected)) {	
		failed_a_test = true;
		console.log("Test failed for command: "+cmd);
	}
};

doTest("TP53", [{gene:"TP53", alterations:false}]);
doTest("TP53;", [{gene:"TP53", alterations:false}]);
doTest("TP53\n", [{gene:"TP53", alterations:false}]);
doTest("TP53 BRCA1 KRAS NRAS", [{gene:"TP53", alterations:false}, {gene:"BRCA1", alterations:false}, {gene:"KRAS", alterations:false}, {gene:"NRAS", alterations:false}]);
doTest("TP53:MUT", [{gene:"TP53", alterations:[{alteration_type: "mut"}]}])
doTest("TP53:MUT;", [{gene:"TP53", alterations:[{alteration_type: "mut"}]}])
doTest("TP53:MUT\n", [{gene:"TP53", alterations:[{alteration_type: "mut"}]}])
doTest("TP53:MUT; BRCA1: AMP HOMDEL EXP>=3 PROT<1", [{gene:"TP53", alterations:[{alteration_type: "mut"}]},
							{gene:"BRCA1", alterations:[{alteration_type: "cna", constr_val: "AMP"}, 
										    {alteration_type: "cna", constr_val: "HOMDEL"},
										    {alteration_type: "exp", constr_rel: ">=", constr_val: 3},
										    {alteration_type: "prot", constr_rel: "<", constr_val: 1}]}])
doTest("TP53:MUT;;;\n BRCA1: AMP HOMDEL EXP>=3 PROT<1", [{gene:"TP53", alterations:[{alteration_type: "mut"}]},
							{gene:"BRCA1", alterations:[{alteration_type: "cna", constr_val: "AMP"}, 
										    {alteration_type: "cna", constr_val: "HOMDEL"},
										    {alteration_type: "exp", constr_rel: ">=", constr_val: 3},
										    {alteration_type: "prot", constr_rel: "<", constr_val: 1}]}])
doTest("TP53:MUT;\n BRCA1: AMP HOMDEL EXP>=3 PROT<1", [{gene:"TP53", alterations:[{alteration_type: "mut"}]},
							{gene:"BRCA1", alterations:[{alteration_type: "cna", constr_val: "AMP"}, 
										    {alteration_type: "cna", constr_val: "HOMDEL"},
										    {alteration_type: "exp", constr_rel: ">=", constr_val: 3},
										    {alteration_type: "prot", constr_rel: "<", constr_val: 1}]}])
doTest("TP53:MUT\n BRCA1: AMP HOMDEL EXP>=3 PROT<1;", [{gene:"TP53", alterations:[{alteration_type: "mut"}]},
							{gene:"BRCA1", alterations:[{alteration_type: "cna", constr_val: "AMP"}, 
										    {alteration_type: "cna", constr_val: "HOMDEL"},
										    {alteration_type: "exp", constr_rel: ">=", constr_val: 3},
										    {alteration_type: "prot", constr_rel: "<", constr_val: 1}]}])

if (!failed_a_test) {
	console.log("Passed all tests!");
}
