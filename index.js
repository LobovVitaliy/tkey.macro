const { createMacro, MacroError } = require('babel-plugin-macros');

function tkey({ references, babel }) {
  references.default.forEach((referencePath) => {
    const path1 = referencePath.parentPath.get('arguments')[0];
    const path2 = referencePath.parentPath.get('arguments')[1];

    if (!path1) {
      throw new MacroError('argument 1 required');
    }

    if (path1.node.type !== 'StringLiteral') {
      throw new MacroError('argument 1 must be StringLiteral');
    }

    if (path2) {
      if (path2.node.type !== 'ObjectExpression') {
        throw new MacroError('argument 2 must be ObjectExpression');
      }

      const node = path2.node.properties.find((node) => node.key.name === 'ns');

      if (!node) {
        throw new MacroError('namespace not specified');
      }

      if (node.value.type !== 'StringLiteral') {
        throw new MacroError('namespace must be StringLiteral');
      }

      path1.parentPath.replaceWith(babel.types.stringLiteral(`${node.value.value}::${path1.node.value}`));
    } else {
      path1.parentPath.replaceWith(babel.types.stringLiteral(path1.node.value));
    }
  });
}

module.exports = createMacro(tkey);
