type JsonValue =
	| null
	| boolean
	| number
	| string
	| JsonValue[]
	| { [key: string]: JsonValue };

interface CSharpClassDef {
	name: string;
	properties: Array<{ jsonKey: string; propName: string; typeName: string }>;
}

type PrimitiveKind = "string" | "number" | "boolean" | "null" | "unknown";

type TsTypeNode =
	| { kind: PrimitiveKind }
	| { kind: "array"; element: TsTypeNode }
	| { kind: "object"; fields: Record<string, TsTypeNode> }
	| { kind: "union"; types: TsTypeNode[] };

const VALID_IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

const toWords = (input: string): string[] =>
	input
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.split(/[^A-Za-z0-9]+/)
		.filter(Boolean);

export const isValidIdentifier = (key: string): boolean =>
	VALID_IDENTIFIER_REGEX.test(key);

export const toPascalCase = (input: string): string => {
	const words = toWords(input);
	if (words.length === 0) return "";

	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join("");
};

export const toCamelCase = (input: string): string => {
	const pascal = toPascalCase(input);
	if (!pascal) return "";
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const isJsonObject = (value: unknown): value is Record<string, JsonValue> => {
	return !!value && typeof value === "object" && !Array.isArray(value);
};

const normalizeUnion = (types: TsTypeNode[]): TsTypeNode => {
	const flattened = types.flatMap((type) =>
		type.kind === "union" ? type.types : [type],
	);

	const unique: TsTypeNode[] = [];
	const seen = new Set<string>();

	flattened.forEach((type) => {
		const key = JSON.stringify(type);
		if (!seen.has(key)) {
			seen.add(key);
			unique.push(type);
		}
	});

	if (unique.length === 1) return unique[0];
	return { kind: "union", types: unique };
};

const mergeTsNodes = (left: TsTypeNode, right: TsTypeNode): TsTypeNode => {
	if (left.kind === "unknown") return right;
	if (right.kind === "unknown") return left;

	if (left.kind === right.kind) {
		if (left.kind === "array" && right.kind === "array") {
			return {
				kind: "array",
				element: mergeTsNodes(left.element, right.element),
			};
		}

		if (left.kind === "object" && right.kind === "object") {
			const allKeys = new Set([
				...Object.keys(left.fields),
				...Object.keys(right.fields),
			]);
			const fields: Record<string, TsTypeNode> = {};

			allKeys.forEach((key) => {
				const l = left.fields[key];
				const r = right.fields[key];

				if (l && r) {
					fields[key] = mergeTsNodes(l, r);
				} else if (l) {
					fields[key] = normalizeUnion([l, { kind: "null" }]);
				} else if (r) {
					fields[key] = normalizeUnion([r, { kind: "null" }]);
				}
			});

			return { kind: "object", fields };
		}

		return left;
	}

	return normalizeUnion([left, right]);
};

const inferTsNode = (value: unknown): TsTypeNode => {
	if (value === null || value === undefined) return { kind: "null" };

	if (typeof value === "string") return { kind: "string" };
	if (typeof value === "number") return { kind: "number" };
	if (typeof value === "boolean") return { kind: "boolean" };

	if (Array.isArray(value)) {
		if (value.length === 0)
			return { kind: "array", element: { kind: "unknown" } };

		const mergedElement = value
			.map((item) => inferTsNode(item))
			.reduce((acc, node) => mergeTsNodes(acc, node), {
				kind: "unknown",
			} as TsTypeNode);

		return { kind: "array", element: mergedElement };
	}

	if (isJsonObject(value)) {
		const fields: Record<string, TsTypeNode> = {};

		Object.entries(value).forEach(([key, nested]) => {
			if (!isValidIdentifier(key)) return;
			fields[key] = inferTsNode(nested);
		});

		return { kind: "object", fields };
	}

	return { kind: "unknown" };
};

const tsInlineType = (
	node: TsTypeNode,
	parentName: string,
	declarations: Map<string, string>,
): string => {
	switch (node.kind) {
		case "string":
		case "number":
		case "boolean":
		case "null":
		case "unknown":
			return node.kind;
		case "array": {
			const elementType = tsInlineType(
				node.element,
				`${parentName}Item`,
				declarations,
			);
			return `(${elementType})[]`;
		}
		case "union": {
			const parts = node.types.map((type, index) =>
				tsInlineType(type, `${parentName}U${index + 1}`, declarations),
			);
			return parts.join(" | ");
		}
		case "object": {
			const interfaceName = toPascalCase(parentName) || "Model";
			if (!declarations.has(interfaceName)) {
				const lines: string[] = [`export interface ${interfaceName} {`];

				Object.entries(node.fields).forEach(([key, fieldNode]) => {
					const fieldType = tsInlineType(
						fieldNode,
						`${interfaceName}${toPascalCase(key)}`,
						declarations,
					);
					lines.push(`  ${key}: ${fieldType};`);
				});

				lines.push("}");
				declarations.set(interfaceName, lines.join("\n"));
			}

			return interfaceName;
		}
		default:
			return "unknown";
	}
};

const csharpPrimitive = (value: unknown): string => {
	if (typeof value === "string") return "string";
	if (typeof value === "boolean") return "bool";
	if (typeof value === "number")
		return Number.isInteger(value) ? "int" : "double";
	if (value === null || value === undefined) return "object?";
	return "object";
};

const inferArrayCSharpType = (
	arr: unknown[],
	classes: CSharpClassDef[],
	parentClassName: string,
	key: string,
): string => {
	if (arr.length === 0) return "List<object>";

	const nonNullItems = arr.filter(
		(item) => item !== null && item !== undefined,
	);
	if (nonNullItems.length === 0) return "List<object?>";

	const first = nonNullItems[0];

	if (isJsonObject(first)) {
		const className = `${parentClassName}${toPascalCase(key)}Item`;
		buildCSharpClass(className, first, classes);
		return `List<${className}>`;
	}

	if (Array.isArray(first)) return "List<object>";

	const firstType = csharpPrimitive(first);
	const homogeneous = nonNullItems.every(
		(item) => csharpPrimitive(item) === firstType,
	);
	return homogeneous ? `List<${firstType}>` : "List<object>";
};

const buildCSharpClass = (
	className: string,
	obj: Record<string, JsonValue>,
	classes: CSharpClassDef[],
): void => {
	if (classes.some((cls) => cls.name === className)) return;

	const classDef: CSharpClassDef = {
		name: className,
		properties: [],
	};

	Object.entries(obj).forEach(([key, value]) => {
		if (!isValidIdentifier(key)) return;

		const propName = toPascalCase(key);
		if (!propName) return;

		let typeName = "object";

		if (isJsonObject(value)) {
			const nestedClassName = `${className}${toPascalCase(key)}`;
			buildCSharpClass(nestedClassName, value, classes);
			typeName = nestedClassName;
		} else if (Array.isArray(value)) {
			typeName = inferArrayCSharpType(value, classes, className, key);
		} else {
			typeName = csharpPrimitive(value);
		}

		classDef.properties.push({
			jsonKey: key,
			propName,
			typeName,
		});
	});

	classes.push(classDef);
};

export const generateCSharpClasses = (
	value: unknown,
	rootName = "Model",
): string => {
	const className = toPascalCase(rootName) || "Model";
	const classes: CSharpClassDef[] = [];

	if (isJsonObject(value)) {
		buildCSharpClass(className, value, classes);
	} else {
		classes.push({
			name: className,
			properties: [
				{
					jsonKey: "value",
					propName: "Value",
					typeName: Array.isArray(value)
						? "List<object>"
						: isJsonObject(value)
							? "object"
							: csharpPrimitive(value),
				},
			],
		});
	}

	const ordered = [...classes].sort((a, b) =>
		a.name === className
			? -1
			: b.name === className
				? 1
				: a.name.localeCompare(b.name),
	);

	const chunks: string[] = [
		"using System.Collections.Generic;",
		"using System.Text.Json.Serialization;",
		"",
	];

	ordered.forEach((cls, idx) => {
		chunks.push(`public class ${cls.name}`);
		chunks.push("{");

		cls.properties.forEach((prop) => {
			chunks.push(`    [JsonPropertyName("${prop.jsonKey}")]`);
			chunks.push(`    public ${prop.typeName} ${prop.propName} { get; set; }`);
			chunks.push("");
		});

		if (cls.properties.length > 0) {
			chunks.pop();
		}

		chunks.push("}");
		if (idx < ordered.length - 1) chunks.push("");
	});

	return chunks.join("\n");
};

export const generateTypeScriptInterfaces = (
	value: unknown,
	rootName = "Model",
): string => {
	const rootInterface = toPascalCase(rootName) || "Model";
	const declarations = new Map<string, string>();

	let rootNode = inferTsNode(value);
	if (rootNode.kind !== "object") {
		rootNode = { kind: "object", fields: { value: rootNode } };
	}

	tsInlineType(rootNode, rootInterface, declarations);

	const ordered = Array.from(declarations.entries()).sort(([a], [b]) => {
		if (a === rootInterface) return -1;
		if (b === rootInterface) return 1;
		return a.localeCompare(b);
	});

	return ordered.map(([, code]) => code).join("\n\n");
};

// ─── Shared snake_case helper ──────────────────────────────────────────────────

export const toSnakeCase = (input: string): string => {
	const words = toWords(input);
	return words.map((w) => w.toLowerCase()).join("_");
};

// ─── Java POJO ─────────────────────────────────────────────────────────────────

interface JavaClassDef {
	name: string;
	fields: Array<{ jsonKey: string; fieldName: string; typeName: string }>;
}

const javaPrimitive = (value: unknown): string => {
	if (typeof value === "string") return "String";
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number")
		return Number.isInteger(value) ? "int" : "double";
	if (value === null || value === undefined) return "Object";
	return "Object";
};

const inferArrayJavaType = (
	arr: unknown[],
	classes: JavaClassDef[],
	parentName: string,
	key: string,
): string => {
	if (arr.length === 0) return "List<Object>";
	const first = arr.find((i) => i !== null && i !== undefined);
	if (!first) return "List<Object>";
	if (isJsonObject(first)) {
		const className = `${parentName}${toPascalCase(key)}Item`;
		buildJavaClass(className, first, classes);
		return `List<${className}>`;
	}
	return `List<${javaPrimitive(first)}>`;
};

const buildJavaClass = (
	className: string,
	obj: Record<string, JsonValue>,
	classes: JavaClassDef[],
): void => {
	if (classes.some((c) => c.name === className)) return;
	const def: JavaClassDef = { name: className, fields: [] };

	Object.entries(obj).forEach(([key, value]) => {
		if (!isValidIdentifier(key)) return;
		const fieldName = toCamelCase(key);
		if (!fieldName) return;
		let typeName = "Object";
		if (isJsonObject(value)) {
			const nested = `${className}${toPascalCase(key)}`;
			buildJavaClass(nested, value, classes);
			typeName = nested;
		} else if (Array.isArray(value)) {
			typeName = inferArrayJavaType(value, classes, className, key);
		} else {
			typeName = javaPrimitive(value);
		}
		def.fields.push({ jsonKey: key, fieldName, typeName });
	});
	classes.push(def);
};

export const generateJavaClasses = (
	value: unknown,
	rootName = "Model",
): string => {
	const className = toPascalCase(rootName) || "Model";
	const classes: JavaClassDef[] = [];

	if (isJsonObject(value)) {
		buildJavaClass(className, value, classes);
	} else {
		classes.push({
			name: className,
			fields: [
				{
					jsonKey: "value",
					fieldName: "value",
					typeName: javaPrimitive(value),
				},
			],
		});
	}

	const ordered = [...classes].sort((a, b) =>
		a.name === className
			? -1
			: b.name === className
				? 1
				: a.name.localeCompare(b.name),
	);

	const chunks: string[] = [
		"import java.util.List;",
		"import com.google.gson.annotations.SerializedName;",
		"",
	];

	ordered.forEach((cls, idx) => {
		chunks.push(`public class ${cls.name} {`);
		cls.fields.forEach((f) => {
			chunks.push(`    @SerializedName("${f.jsonKey}")`);
			chunks.push(`    private ${f.typeName} ${f.fieldName};`);
			chunks.push("");
		});
		if (cls.fields.length > 0) chunks.pop();
		chunks.push("}");
		if (idx < ordered.length - 1) chunks.push("");
	});

	return chunks.join("\n");
};

// ─── Python Pydantic ───────────────────────────────────────────────────────────

const pythonPrimitive = (value: unknown): string => {
	if (typeof value === "string") return "str";
	if (typeof value === "boolean") return "bool";
	if (typeof value === "number")
		return Number.isInteger(value) ? "int" : "float";
	if (value === null || value === undefined) return "Any";
	return "Any";
};

interface PyModelDef {
	name: string;
	fields: Array<{ jsonKey: string; fieldName: string; typeName: string }>;
}

const inferArrayPyType = (
	arr: unknown[],
	models: PyModelDef[],
	parentName: string,
	key: string,
): string => {
	if (arr.length === 0) return "list[Any]";
	const first = arr.find((i) => i !== null && i !== undefined);
	if (!first) return "list[Any]";
	if (isJsonObject(first)) {
		const name = `${parentName}${toPascalCase(key)}Item`;
		buildPyModel(name, first, models);
		return `list[${name}]`;
	}
	return `list[${pythonPrimitive(first)}]`;
};

const buildPyModel = (
	name: string,
	obj: Record<string, JsonValue>,
	models: PyModelDef[],
): void => {
	if (models.some((m) => m.name === name)) return;
	const def: PyModelDef = { name, fields: [] };

	Object.entries(obj).forEach(([key, value]) => {
		if (!isValidIdentifier(key)) return;
		const fieldName = toSnakeCase(key);
		let typeName = "Any";
		if (isJsonObject(value)) {
			const nested = `${name}${toPascalCase(key)}`;
			buildPyModel(nested, value, models);
			typeName = nested;
		} else if (Array.isArray(value)) {
			typeName = inferArrayPyType(value, models, name, key);
		} else {
			typeName = pythonPrimitive(value);
		}
		def.fields.push({ jsonKey: key, fieldName, typeName });
	});
	models.push(def);
};

export const generatePythonModels = (
	value: unknown,
	rootName = "Model",
): string => {
	const name = toPascalCase(rootName) || "Model";
	const models: PyModelDef[] = [];

	if (isJsonObject(value)) {
		buildPyModel(name, value, models);
	} else {
		models.push({
			name,
			fields: [
				{
					jsonKey: "value",
					fieldName: "value",
					typeName: pythonPrimitive(value),
				},
			],
		});
	}

	const reversed = [...models].reverse();
	const chunks: string[] = [
		"from pydantic import BaseModel, Field",
		"from typing import Any",
		"",
	];

	reversed.forEach((m, idx) => {
		chunks.push(`class ${m.name}(BaseModel):`);
		m.fields.forEach((f) => {
			const alias =
				f.fieldName !== f.jsonKey ? ` = Field(alias="${f.jsonKey}")` : "";
			chunks.push(`    ${f.fieldName}: ${f.typeName}${alias}`);
		});
		if (idx < reversed.length - 1) chunks.push("");
	});

	return chunks.join("\n");
};

// ─── Go Struct ─────────────────────────────────────────────────────────────────

const goPrimitive = (value: unknown): string => {
	if (typeof value === "string") return "string";
	if (typeof value === "boolean") return "bool";
	if (typeof value === "number")
		return Number.isInteger(value) ? "int" : "float64";
	if (value === null || value === undefined) return "interface{}";
	return "interface{}";
};

interface GoStructDef {
	name: string;
	fields: Array<{ jsonKey: string; fieldName: string; typeName: string }>;
}

const inferArrayGoType = (
	arr: unknown[],
	structs: GoStructDef[],
	parentName: string,
	key: string,
): string => {
	if (arr.length === 0) return "[]interface{}";
	const first = arr.find((i) => i !== null && i !== undefined);
	if (!first) return "[]interface{}";
	if (isJsonObject(first)) {
		const name = `${parentName}${toPascalCase(key)}Item`;
		buildGoStruct(name, first, structs);
		return `[]${name}`;
	}
	return `[]${goPrimitive(first)}`;
};

const buildGoStruct = (
	name: string,
	obj: Record<string, JsonValue>,
	structs: GoStructDef[],
): void => {
	if (structs.some((s) => s.name === name)) return;
	const def: GoStructDef = { name, fields: [] };

	Object.entries(obj).forEach(([key, value]) => {
		if (!isValidIdentifier(key)) return;
		const fieldName = toPascalCase(key);
		let typeName = "interface{}";
		if (isJsonObject(value)) {
			const nested = `${name}${toPascalCase(key)}`;
			buildGoStruct(nested, value, structs);
			typeName = nested;
		} else if (Array.isArray(value)) {
			typeName = inferArrayGoType(value, structs, name, key);
		} else {
			typeName = goPrimitive(value);
		}
		def.fields.push({ jsonKey: key, fieldName, typeName });
	});
	structs.push(def);
};

export const generateGoStructs = (
	value: unknown,
	rootName = "Model",
): string => {
	const name = toPascalCase(rootName) || "Model";
	const structs: GoStructDef[] = [];

	if (isJsonObject(value)) {
		buildGoStruct(name, value, structs);
	} else {
		structs.push({
			name,
			fields: [
				{ jsonKey: "value", fieldName: "Value", typeName: goPrimitive(value) },
			],
		});
	}

	const ordered = [...structs].sort((a, b) =>
		a.name === name ? -1 : b.name === name ? 1 : a.name.localeCompare(b.name),
	);

	const chunks: string[] = ["package model", ""];

	ordered.forEach((s, idx) => {
		chunks.push(`type ${s.name} struct {`);
		s.fields.forEach((f) => {
			chunks.push(`\t${f.fieldName} ${f.typeName} \`json:"${f.jsonKey}"\``);
		});
		chunks.push("}");
		if (idx < ordered.length - 1) chunks.push("");
	});

	return chunks.join("\n");
};

// ─── Kotlin Data Class ─────────────────────────────────────────────────────────

const kotlinPrimitive = (value: unknown): string => {
	if (typeof value === "string") return "String";
	if (typeof value === "boolean") return "Boolean";
	if (typeof value === "number")
		return Number.isInteger(value) ? "Int" : "Double";
	if (value === null || value === undefined) return "Any?";
	return "Any";
};

interface KotlinClassDef {
	name: string;
	fields: Array<{ jsonKey: string; fieldName: string; typeName: string }>;
}

const inferArrayKotlinType = (
	arr: unknown[],
	classes: KotlinClassDef[],
	parentName: string,
	key: string,
): string => {
	if (arr.length === 0) return "List<Any>";
	const first = arr.find((i) => i !== null && i !== undefined);
	if (!first) return "List<Any>";
	if (isJsonObject(first)) {
		const name = `${parentName}${toPascalCase(key)}Item`;
		buildKotlinClass(name, first, classes);
		return `List<${name}>`;
	}
	return `List<${kotlinPrimitive(first)}>`;
};

const buildKotlinClass = (
	name: string,
	obj: Record<string, JsonValue>,
	classes: KotlinClassDef[],
): void => {
	if (classes.some((c) => c.name === name)) return;
	const def: KotlinClassDef = { name, fields: [] };

	Object.entries(obj).forEach(([key, value]) => {
		if (!isValidIdentifier(key)) return;
		const fieldName = toCamelCase(key);
		if (!fieldName) return;
		let typeName = "Any";
		if (isJsonObject(value)) {
			const nested = `${name}${toPascalCase(key)}`;
			buildKotlinClass(nested, value, classes);
			typeName = nested;
		} else if (Array.isArray(value)) {
			typeName = inferArrayKotlinType(value, classes, name, key);
		} else {
			typeName = kotlinPrimitive(value);
		}
		def.fields.push({ jsonKey: key, fieldName, typeName });
	});
	classes.push(def);
};

export const generateKotlinDataClasses = (
	value: unknown,
	rootName = "Model",
): string => {
	const name = toPascalCase(rootName) || "Model";
	const classes: KotlinClassDef[] = [];

	if (isJsonObject(value)) {
		buildKotlinClass(name, value, classes);
	} else {
		classes.push({
			name,
			fields: [
				{
					jsonKey: "value",
					fieldName: "value",
					typeName: kotlinPrimitive(value),
				},
			],
		});
	}

	const ordered = [...classes].sort((a, b) =>
		a.name === name ? -1 : b.name === name ? 1 : a.name.localeCompare(b.name),
	);

	const chunks: string[] = [
		"import com.google.gson.annotations.SerializedName",
		"",
	];

	ordered.forEach((cls, idx) => {
		const params = cls.fields
			.map((f) => {
				const annotation =
					f.fieldName !== f.jsonKey
						? `    @SerializedName("${f.jsonKey}")\n`
						: "";
				return `${annotation}    val ${f.fieldName}: ${f.typeName}`;
			})
			.join(",\n");
		chunks.push(`data class ${cls.name}(\n${params}\n)`);
		if (idx < ordered.length - 1) chunks.push("");
	});

	return chunks.join("\n");
};

// ─── Dart Class ────────────────────────────────────────────────────────────────

const dartPrimitive = (value: unknown): string => {
	if (typeof value === "string") return "String";
	if (typeof value === "boolean") return "bool";
	if (typeof value === "number")
		return Number.isInteger(value) ? "int" : "double";
	if (value === null || value === undefined) return "dynamic";
	return "dynamic";
};

interface DartClassDef {
	name: string;
	fields: Array<{ jsonKey: string; fieldName: string; typeName: string }>;
}

const inferArrayDartType = (
	arr: unknown[],
	classes: DartClassDef[],
	parentName: string,
	key: string,
): string => {
	if (arr.length === 0) return "List<dynamic>";
	const first = arr.find((i) => i !== null && i !== undefined);
	if (!first) return "List<dynamic>";
	if (isJsonObject(first)) {
		const name = `${parentName}${toPascalCase(key)}Item`;
		buildDartClass(name, first, classes);
		return `List<${name}>`;
	}
	return `List<${dartPrimitive(first)}>`;
};

const buildDartClass = (
	name: string,
	obj: Record<string, JsonValue>,
	classes: DartClassDef[],
): void => {
	if (classes.some((c) => c.name === name)) return;
	const def: DartClassDef = { name, fields: [] };

	Object.entries(obj).forEach(([key, value]) => {
		if (!isValidIdentifier(key)) return;
		const fieldName = toCamelCase(key);
		if (!fieldName) return;
		let typeName = "dynamic";
		if (isJsonObject(value)) {
			const nested = `${name}${toPascalCase(key)}`;
			buildDartClass(nested, value, classes);
			typeName = nested;
		} else if (Array.isArray(value)) {
			typeName = inferArrayDartType(value, classes, name, key);
		} else {
			typeName = dartPrimitive(value);
		}
		def.fields.push({ jsonKey: key, fieldName, typeName });
	});
	classes.push(def);
};

export const generateDartClasses = (
	value: unknown,
	rootName = "Model",
): string => {
	const name = toPascalCase(rootName) || "Model";
	const classes: DartClassDef[] = [];

	if (isJsonObject(value)) {
		buildDartClass(name, value, classes);
	} else {
		classes.push({
			name,
			fields: [
				{
					jsonKey: "value",
					fieldName: "value",
					typeName: dartPrimitive(value),
				},
			],
		});
	}

	const ordered = [...classes].sort((a, b) =>
		a.name === name ? -1 : b.name === name ? 1 : a.name.localeCompare(b.name),
	);

	const chunks: string[] = [];

	ordered.forEach((cls, idx) => {
		chunks.push(`class ${cls.name} {`);
		cls.fields.forEach((f) => {
			chunks.push(`  final ${f.typeName} ${f.fieldName};`);
		});
		chunks.push("");

		// Constructor
		const ctorParams = cls.fields
			.map((f) => `required this.${f.fieldName}`)
			.join(", ");
		chunks.push(`  ${cls.name}({${ctorParams}});`);
		chunks.push("");

		// fromJson factory
		chunks.push(`  factory ${cls.name}.fromJson(Map<String, dynamic> json) {`);
		chunks.push(`    return ${cls.name}(`);
		cls.fields.forEach((f) => {
			chunks.push(`      ${f.fieldName}: json['${f.jsonKey}'],`);
		});
		chunks.push("    );");
		chunks.push("  }");
		chunks.push("");

		// toJson method
		chunks.push("  Map<String, dynamic> toJson() {");
		chunks.push("    return {");
		cls.fields.forEach((f) => {
			chunks.push(`      '${f.jsonKey}': ${f.fieldName},`);
		});
		chunks.push("    };");
		chunks.push("  }");

		chunks.push("}");
		if (idx < ordered.length - 1) chunks.push("");
	});

	return chunks.join("\n");
};
