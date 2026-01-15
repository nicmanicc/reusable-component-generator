"use server";
import { prisma } from "@/utils/prisma/client";
/* id                 String               @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id            String               @db.Uuid
  title              String
  description        String?
  created_at         DateTime?            @default(now()) @db.Timestamptz(6)
  chat_messages      chat_messages[]
  component_versions component_versions[]
  users   */
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
      chat_messages: true,
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

/*  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  version_number Int
  prompt         String
  generated_code String
  created_at     DateTime? @default(now()) @db.Timestamptz(6)
  projects       projects  @relation(fields: [project_id], references: [id], onDelete: Cascade, onUpdate: NoAction) */
export async function createComponent(project_id: string, title: string) {
  return prisma.project_components.create({
    data: {
      project_id: project_id,
      title: title,
    },
  });
}
