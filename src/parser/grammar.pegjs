// Basic Glimma DSL grammar (MVP subset)

Start
  = _ scenes:Scene+ { return { type: 'Document', scenes } }

Scene
  = 'scene' _ name:Identifier _ '{' _ items:Item* '}' _ {
      return { type: 'Scene', name, items };
    }

Item
  = Shape

Shape
  = 'shape' _ id:Identifier _ type:Identifier _ attrs:AttributeList? _ {
      return { type: 'Shape', id, shapeType: type, attrs: attrs || [] };
    }

AttributeList
  = _ attrs:Attribute+ { return attrs }

Attribute
  = name:Identifier '=' value:Value _ {
      return { name, value };
    }

Value
  = QuotedString / Number / Identifier

Identifier
  = [a-zA-Z_][a-zA-Z0-9_-]* { return text() }

Number
  = [0-9]+ { return text() }

QuotedString
  = '"' chars:([^"\\] / '\\' .)* '"' {
      return chars.join('');
    }

_ "whitespace"
  = [ \t\n\r]*
