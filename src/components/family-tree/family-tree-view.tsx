import Link from "next/link";

import type { FamilyTreeNode } from "@/types/domain";

export function FamilyTreeView({
  nodes,
  roots
}: {
  nodes: FamilyTreeNode[];
  roots: FamilyTreeNode[];
}) {
  const map = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
      <div className="flex flex-wrap gap-5">
        {roots.map((root) => (
          <div key={root.id} className="min-w-[260px] flex-1 rounded-[24px] bg-ivory/70 p-5">
            <TreeNode node={root} map={map} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TreeNode({ node, map }: { node: FamilyTreeNode; map: Map<string, FamilyTreeNode> }) {
  const children = node.children.map((id) => map.get(id)).filter(Boolean) as FamilyTreeNode[];

  return (
    <div className="space-y-4">
      <Link
        href={`/people/${node.id}`}
        className={`block rounded-3xl border px-4 py-4 ${node.isSelf ? "border-moss bg-moss text-white" : "border-clay/15 bg-white text-moss"}`}
      >
        <p className="font-medium">{node.name}</p>
        <p className={`mt-1 text-sm ${node.isSelf ? "text-white/80" : "text-clay"}`}>{node.relationName || "家庭成员"}</p>
      </Link>

      {node.spouses.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {node.spouses.map((id) => {
            const spouse = map.get(id);
            if (!spouse) {
              return null;
            }

            return (
              <Link key={spouse.id} href={`/people/${spouse.id}`} className="rounded-2xl border border-clay/15 bg-parchment/70 px-4 py-2 text-sm text-clay">
                伴侣：{spouse.name}
              </Link>
            );
          })}
        </div>
      ) : null}

      {children.length > 0 ? (
        <div className="space-y-4 border-l border-dashed border-clay/30 pl-5">
          {children.map((child) => (
            <TreeNode key={child.id} node={child} map={map} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
