// Basic Glimma DSL grammar (MVP subset)

Start
  = _ scenes:Scene+ { return { type: "Document", scenes }; }

Scene
  = "scene" _ name:Identifier _ "{" _ sceneItems:SceneItem* "}" _ { return { type: "Scene", name: name, items: sceneItems }; }

SceneItem
  = Shape
  / Group
  / Timeline

Group
  = "group" _ id:Identifier _ "{" _ groupItems:GroupItem* "}" _ { return { type: "Group", id: id, items: groupItems }; }

GroupItem
  = Shape
  / Group

Shape
  = "shape" _ id:Identifier _ type:Identifier _ attrs:AttributeList? _ {
      return { type: "Shape", id: id, shapeType: type, attrs: attrs || [] };
    }

Timeline
  = "timeline:" _ entries:TimelineEntry+ { return { type: "Timeline", entries: entries }; }

TimelineEntry
  = time:Number "s:" _ target:Identifier _ action:Identifier
    entryHead:TimelinePart*
    entryTail:(_ TimelineContPart)* {
      const parts = entryHead.concat(...entryTail.flat());
      const attrs = parts.filter(p => p.type === "Attribute");
      const over  = parts.find(p => p.type === "OverClause");
      const dur   = over ? over.dur : 0;
      return { type: "TimelineEntry", time: time, target: target, action: action, attrs: attrs, dur: dur };
    }

TimelineContPart
  = Newline Indent moreParts:TimelinePart+ { return moreParts; }

TimelinePart
  = _ part:(Attribute / OverClause) _ { return part; }

OverClause
  = "over" _ dur:Number "s" { return { type: "OverClause", dur: dur }; }

AttributeList
  = _ attrList:Attribute+ { return attrList; }

Attribute
  = name:Identifier "=" value:Value {
      return { type: "Attribute", name: name, value: value };
    }

Value
  = QuotedString / Number / Identifier

Identifier
  = [a-zA-Z_][a-zA-Z0-9_-]* { return text(); }

Number
  = "-"? [0-9]+ ("." [0-9]+)? { return parseFloat(text()); }

QuotedString
  = '"' chars:([^"\\"] / "\\" .)* '"' {
      return chars.map(char => char[0] === "\\" ? char[1] : char).join("");
    }

Comment
  = "#" [^\n]*

_ "whitespace"
  = ( [ \t\n\r] / Comment )*

Newline = _? [\n\r] _?
Indent  = [ \t]+
