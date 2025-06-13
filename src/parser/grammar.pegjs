// Basic Glimma DSL grammar (MVP subset)

Start
  = _ scenes:Scene+ { return { type: 'Document', scenes } }

Scene
  = 'scene' _ name:Identifier _ '{' _ items:SceneItem* '}' _ {
      return { type: 'Scene', name, items };
    }

SceneItem
  = Shape
  / Group
  / Timeline

Group
  = 'group' _ id:Identifier _ '{' _ items:GroupItem* '}' _ {
      return { type: 'Group', id, items };
    }

GroupItem
  = Shape
  / Group

Shape
  = 'shape' _ id:Identifier _ type:Identifier _ attrs:AttributeList? _ {
      return { type: 'Shape', id, shapeType: type, attrs: attrs || [] };
    }

Timeline
  = 'timeline:' _ entries:TimelineEntry+ { return { type: 'Timeline', entries } }

TimelineEntry
  = time:Number 's:' _ target:Identifier _ action:Identifier _ attrs:AttributeList? _ 'over' _ dur:Number 's' _ {
      return { type: 'TimelineEntry', time, target, action, attrs: attrs || [], dur };
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
  = [0-9]+ ('.' [0-9]+)? { return parseFloat(text()) }

QuotedString
  = '"' chars:([^"\\] / '\\' .)* '"' {
      return chars.map((char: any) => char[0] === '\\' ? char[1] : char).join('');
    }

Comment
  = '#' [^\n]*

_ "whitespace"
  = ( [ \t\n\r] / Comment )*
