import { FamilyTreeView } from "@/components/family-tree/family-tree-view";
import { PageHeader } from "@/components/common/page-header";
import { getFamilyTree } from "@/server/services/familyTreeService";

export default async function FamilyTreePage() {
  const tree = await getFamilyTree();

  return (
    <div className="space-y-4">
      <PageHeader title="家族族谱" description="第一版采用轻量级树状布局，后续可以替换为更复杂的 React Flow 或 D3 方案。" />
      <FamilyTreeView nodes={tree.nodes} roots={tree.roots} />
    </div>
  );
}
