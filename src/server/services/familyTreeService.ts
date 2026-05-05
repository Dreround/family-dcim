import { RelationType } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { FamilyTreeNode } from "@/types/domain";

export async function getFamilyTree() {
  const [people, relations] = await Promise.all([
    prisma.person.findMany({
      orderBy: [{ isSelf: "desc" }, { birthDate: "asc" }, { createdAt: "asc" }]
    }),
    prisma.familyRelation.findMany()
  ]);

  const nodes = new Map<string, FamilyTreeNode>();

  for (const person of people) {
    nodes.set(person.id, {
      id: person.id,
      name: person.name,
      relationName: person.relationName,
      avatarUrl: person.avatarUrl,
      isSelf: person.isSelf,
      parents: [],
      spouses: [],
      children: []
    });
  }

  for (const relation of relations) {
    const from = nodes.get(relation.fromPersonId);
    const to = nodes.get(relation.toPersonId);
    if (!from || !to) {
      continue;
    }

    if (relation.relationType === RelationType.PARENT) {
      from.children.push(to.id);
      to.parents.push(from.id);
    }

    if (relation.relationType === RelationType.CHILD) {
      from.parents.push(to.id);
      to.children.push(from.id);
    }

    if (relation.relationType === RelationType.SPOUSE) {
      from.spouses.push(to.id);
    }
  }

  const roots = Array.from(nodes.values()).filter((node) => node.parents.length === 0);

  return {
    roots,
    nodes: Array.from(nodes.values())
  };
}
