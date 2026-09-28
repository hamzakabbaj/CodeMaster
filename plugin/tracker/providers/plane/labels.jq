# CodeMaster × Plane — which project label plays each CodeMaster role.
# input: the project's labels array. $cfg: config .plane.labels (may be {}).
# output: {role: {name, id} | {missing: <name to create>, color}}
# A name pinned in $cfg wins; otherwise match by meaning, ignoring emoji and case.
def norm: ascii_downcase | gsub("[^a-z ]"; "") | gsub("^ +| +$"; "") | gsub(" +"; " ");
def roles: {
  epic:    {default: "👑 Epic",    color: "#ff6900", aliases: ["epic"]},
  feature: {default: "🧩 Feature", color: "#00d084", aliases: ["feature"]},
  story:   {default: "📖 US",      color: "#0693e3", aliases: ["us", "user story", "story"]},
  task:    {default: "📋 Task",    color: "#fcb900", aliases: ["task"]},
  chore:   {default: "🧹 Chore",   color: "#abb8c3", aliases: ["chore"]},
  fix:     {default: "🐞 Bug",     color: "#eb144c", aliases: ["bug", "fix"]},
  spike:   {default: "🔬 Spike",   color: "#8ed1fc", aliases: ["spike"]},
  enabler: {default: "🧱 Enabler", color: "#9900ef", aliases: ["enabler"]},
  blocked: {default: "⛔ Blocked", color: "#d93d42", aliases: ["blocked"]}
};
. as $labels
| roles | with_entries(
    .key as $role | .value as $r
    | ($cfg[$role] // null) as $want
    | ( if $want then [$labels[] | select(.name == $want)]
        else [$labels[] | select((.name | norm) as $n | $r.aliases | index($n))] end ) as $hits
    | .value = (if ($hits | length) > 0 then {name: $hits[0].name, id: $hits[0].id}
                else {missing: ($want // $r.default), color: $r.color} end))
