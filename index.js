const { createMacro } = require('babel-plugin-macros');

function tkey({ references, babel }) {
  references.default.forEach((referencePath) => {
    const path = referencePath.parentPath.get('arguments')[0];
    path.parentPath.replaceWith(babel.types.stringLiteral(path.node.value));
  });
}

module.exports = createMacro(tkey);
