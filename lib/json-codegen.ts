type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

interface CSharpClassDef {
  name: string;
  properties: Array<{ jsonKey: string; propName: string; typeName: string }>;
}

type PrimitiveKind = 'string' | 'number' | 'boolean' | 'null' | 'unknown';

type TsTypeNode =
  | { kind: PrimitiveKind }
  | { kind: 'array'; element: TsTypeNode }
  | { kind: 'object'; fields: Record<string, TsTypeNode> }
  | { kind: 'union'; types: TsTypeNode[] };

const VALID_IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

const toWords = (input: string): string[] =>
  input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);

export const isValidIdentifier = (key: string): boolean => VALID_IDENTIFIER_REGEX.test(key);

export const toPascalCase = (input: string): string => {
  const words = toWords(input);
  if (words.length === 0) return '';

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

export const toCamelCase = (input: string): string => {
  const pascal = toPascalCase(input);
  if (!pascal) return '';
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const isJsonObject = (value: unknown): value is Record<string, JsonValue> => {
  return !!value && typeof value === 'object' && !Array.isArray(value);
};

const normalizeUnion = (types: TsTypeNode[]): TsTypeNode => {
  const flattened = types.flatMap((type) => (type.kind === 'union' ? type.types : [type]));

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
  return { kind: 'union', types: unique };
};

const mergeTsNodes = (left: TsTypeNode, right: TsTypeNode): TsTypeNode => {
  if (left.kind === 'unknown') return right;
  if (right.kind === 'unknown') return left;

  if (left.kind === right.kind) {
    if (left.kind === 'array' && right.kind === 'array') {
      return { kind: 'array', element: mergeTsNodes(left.element, right.element) };
    }

    if (left.kind === 'object' && right.kind === 'object') {
      const allKeys = new Set([...Object.keys(left.fields), ...Object.keys(right.fields)]);
      const fields: Record<string, TsTypeNode> = {};

      allKeys.forEach((key) => {
        const l = left.fields[key];
        const r = right.fields[key];

        if (l && r) {
          fields[key] = mergeTsNodes(l, r);
        } else if (l) {
          fields[key] = normalizeUnion([l, { kind: 'null' }]);
        } else if (r) {
          fields[key] = normalizeUnion([r, { kind: 'null' }]);
        }
      });

      return { kind: 'object', fields };
    }

    return left;
  }

  return normalizeUnion([left, right]);
};

const inferTsNode = (value: unknown): TsTypeNode => {
  if (value === null || value === undefined) return { kind: 'null' };

  if (typeof value === 'string') return { kind: 'string' };
  if (typeof value === 'number') return { kind: 'number' };
  if (typeof value === 'boolean') return { kind: 'boolean' };

  if (Array.isArray(value)) {
    if (value.length === 0) return { kind: 'array', element: { kind: 'unknown' } };

    const mergedElement = value
      .map((item) => inferTsNode(item))
      .reduce((acc, node) => mergeTsNodes(acc, node), { kind: 'unknown' } as TsTypeNode);

    return { kind: 'array', element: mergedElement };
  }

  if (isJsonObject(value)) {
    const fields: Record<string, TsTypeNode> = {};

    Object.entries(value).forEach(([key, nested]) => {
      if (!isValidIdentifier(key)) return;
      fields[key] = inferTsNode(nested);
    });

    return { kind: 'object', fields };
  }

  return { kind: 'unknown' };
};

const tsInlineType = (
  node: TsTypeNode,
  parentName: string,
  declarations: Map<string, string>,
): string => {
  switch (node.kind) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'null':
    case 'unknown':
      return node.kind;
    case 'array': {
      const elementType = tsInlineType(node.element, `${parentName}Item`, declarations);
      return `(${elementType})[]`;
    }
    case 'union': {
      const parts = node.types.map((type, index) => tsInlineType(type, `${parentName}U${index + 1}`, declarations));
      return parts.join(' | ');
    }
    case 'object': {
      const interfaceName = toPascalCase(parentName) || 'Model';
      if (!declarations.has(interfaceName)) {
        const lines: string[] = [`export interface ${interfaceName} {`];

        Object.entries(node.fields).forEach(([key, fieldNode]) => {
          const fieldType = tsInlineType(fieldNode, `${interfaceName}${toPascalCase(key)}`, declarations);
          lines.push(`  ${key}: ${fieldType};`);
        });

        lines.push('}');
        declarations.set(interfaceName, lines.join('\n'));
      }

      return interfaceName;
    }
    default:
      return 'unknown';
  }
};

const csharpPrimitive = (value: unknown): string => {
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
  if (value === null || value === undefined) return 'object?';
  return 'object';
};

const inferArrayCSharpType = (
  arr: unknown[],
  classes: CSharpClassDef[],
  parentClassName: string,
  key: string,
): string => {
  if (arr.length === 0) return 'List<object>';

  const nonNullItems = arr.filter((item) => item !== null && item !== undefined);
  if (nonNullItems.length === 0) return 'List<object?>';

  const first = nonNullItems[0];

  if (isJsonObject(first)) {
    const className = `${parentClassName}${toPascalCase(key)}Item`;
    buildCSharpClass(className, first, classes);
    return `List<${className}>`;
  }

  if (Array.isArray(first)) return 'List<object>';

  const firstType = csharpPrimitive(first);
  const homogeneous = nonNullItems.every((item) => csharpPrimitive(item) === firstType);
  return homogeneous ? `List<${firstType}>` : 'List<object>';
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

    let typeName = 'object';

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

export const generateCSharpClasses = (value: unknown, rootName = 'Model'): string => {
  const className = toPascalCase(rootName) || 'Model';
  const classes: CSharpClassDef[] = [];

  if (isJsonObject(value)) {
    buildCSharpClass(className, value, classes);
  } else {
    classes.push({
      name: className,
      properties: [
        {
          jsonKey: 'value',
          propName: 'Value',
          typeName: Array.isArray(value)
            ? 'List<object>'
            : isJsonObject(value)
              ? 'object'
              : csharpPrimitive(value),
        },
      ],
    });
  }

  const ordered = [...classes].sort((a, b) =>
    a.name === className ? -1 : b.name === className ? 1 : a.name.localeCompare(b.name),
  );

  const chunks: string[] = ['using System.Collections.Generic;', 'using System.Text.Json.Serialization;', ''];

  ordered.forEach((cls, idx) => {
    chunks.push(`public class ${cls.name}`);
    chunks.push('{');

    cls.properties.forEach((prop) => {
      chunks.push(`    [JsonPropertyName("${prop.jsonKey}")]`);
      chunks.push(`    public ${prop.typeName} ${prop.propName} { get; set; }`);
      chunks.push('');
    });

    if (cls.properties.length > 0) {
      chunks.pop();
    }

    chunks.push('}');
    if (idx < ordered.length - 1) chunks.push('');
  });

  return chunks.join('\n');
};

export const generateTypeScriptInterfaces = (value: unknown, rootName = 'Model'): string => {
  const rootInterface = toPascalCase(rootName) || 'Model';
  const declarations = new Map<string, string>();

  let rootNode = inferTsNode(value);
  if (rootNode.kind !== 'object') {
    rootNode = { kind: 'object', fields: { value: rootNode } };
  }

  tsInlineType(rootNode, rootInterface, declarations);

  const ordered = Array.from(declarations.entries()).sort(([a], [b]) => {
    if (a === rootInterface) return -1;
    if (b === rootInterface) return 1;
    return a.localeCompare(b);
  });

  return ordered.map(([, code]) => code).join('\n\n');
};
