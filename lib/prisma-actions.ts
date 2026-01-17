"use server";
import { prisma } from "@/utils/prisma/client";

export async function createProject(user_id: string, name: string) {
  return prisma.projects.create({
    data: {
      user_id: user_id,
      title: name,
    },
  });
}

export async function getProject(user_id: string) {
  return prisma.projects.findMany({
    where: {
      user_id: user_id,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      project_components: {
        include: {
          component_versions: true,
        },
      },
    },
  });
}

export async function deleteProject(project_id: string) {
  return prisma.projects.delete({
    where: {
      id: project_id,
    },
  });
}

export async function createComponent(project_id: string, title: string) {
  return prisma.project_components.create({
    data: {
      project_id: project_id,
      title: title,
    },
  });
}

export async function deleteComponent(component_id: string) {
  return prisma.project_components.delete({
    where: {
      id: component_id,
    },
  });
}

/*model component_versions {
  id                 String             @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  component_id       String             @db.Uuid
  version_number     Int
  prompt             String
  generated_code     String
  created_at         DateTime?          @default(now()) @db.Timestamptz(6)
  project_components project_components @relation(fields: [component_id], references: [id], onDelete: Cascade, onUpdate: NoAction)

  @@schema("public")
}*/

export async function createVersion(
  component_id: string,
  version_number: number,
  prompt: string,
  generated_code: string,
) {
  return prisma.component_versions.create({
    data: {
      component_id: component_id,
      version_number: version_number,
      prompt: prompt,
      generated_code: generated_code,
    },
  });
}

export async function getChatMessages(component_id: string) {
  return prisma.chat_messages.findMany({
    where: {
      component_id: component_id,
    },
    orderBy: {
      created_at: "asc",
    },
  });
}

export async function createChatMessage(
  component_id: string,
  role: "user" | "assistant",
  content: string,
) {
  return prisma.chat_messages.create({
    data: {
      component_id: component_id,
      role: role,
      content: content,
    },
  });
}
