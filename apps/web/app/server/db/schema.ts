import { sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "next-auth/adapters";

export const users = sqliteTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text("image"),
	role: text('role', { enum: ["user", "agent", 'admin'] }).default("user"),
});

export type User = Omit<typeof users.$inferSelect, "id">;

export const accounts = sqliteTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	}),
);

export const report = sqliteTable("report", {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text("userId")
	.notNull()
	.references(() => users.id, { onDelete: "cascade" }),
	phone: integer("phone"),
	issue: text('issue', { enum: ["light", "sewage", 'water', 'sanitaion', 'crime', 'miscellaneous'] }).default("miscellaneous").notNull(),
	city: text("city").notNull(),
	address: text("address").notNull(),
	description: text("description").notNull(),
	imageUrl: text("imageUrl"),
	status: text('status', { enum: ["pending", "resolved", 'dismissed'] }).default("pending").notNull(),
  created: integer('created', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  resolved: integer("resolved", { mode: "timestamp_ms" }),
}) 