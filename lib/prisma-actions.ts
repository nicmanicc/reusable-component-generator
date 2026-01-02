import { prisma } from "@/utils/prisma/client";
/* id                 String               @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id            String               @db.Uuid
  title              String
  description        String?
  created_at         DateTime?            @default(now()) @db.Timestamptz(6)
  chat_messages      chat_messages[]
  component_versions component_versions[]
  users   */
export async function createProject(
  user_id: string,
  name: string,
  description: string
) {
  return prisma.projects.create({
    data: {
      user_id: user_id,
      title: name,
      description: description,
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
  project_id     String    @db.Uuid
  version_number Int
  prompt         String
  generated_code String
  created_at     DateTime? @default(now()) @db.Timestamptz(6)
  projects       projects  @relation(fields: [project_id], references: [id], onDelete: Cascade, onUpdate: NoAction) */
export async function createComponentVersion(
  project_id: string,
  version_number: number,
  generated_code: string,
  prompt: string
) {
  return prisma.component_versions.create({
    data: {
      project_id: project_id,
      version_number: version_number,
      generated_code: generated_code,
      prompt: prompt,
    },
  });
}
