import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

function serialize(profile: typeof userProfiles.$inferSelect) {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    role: profile.role,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id));
  if (profile) return NextResponse.json(serialize(profile));

  const [created] = await db
    .insert(userProfiles)
    .values({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.name.slice(0, 2).toUpperCase(),
      role: "tester",
    })
    .onConflictDoNothing()
    .returning();
  return NextResponse.json(created ? serialize(created) : null);
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
  const avatar = typeof body.avatar === "string" ? body.avatar.trim().slice(0, 4) : "";
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const [updated] = await db
    .update(userProfiles)
    .set({ name, avatar: avatar || name.slice(0, 2).toUpperCase(), updatedAt: new Date() })
    .where(eq(userProfiles.id, user.id))
    .returning();

  await auth.api.updateUser({ headers: await headers(), body: { name } });

  return NextResponse.json(updated ? serialize(updated) : null);
}
