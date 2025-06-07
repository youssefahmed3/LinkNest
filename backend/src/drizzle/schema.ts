import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'

export const userTable = sqliteTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).$defaultFn(() => false).notNull(),
    image: text('image'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
}, table => {
    return {
        emailIndex: uniqueIndex("emailIndex").on(table.email),
    }
});

// Sessions table - REQUIRED for better-auth
export const sessionsTable = sqliteTable('session', { // Note: 'session' not 'sessions'
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' })
});

// Accounts table - REQUIRED for better-auth (stores password hashes)
export const accountsTable = sqliteTable('account', { // Note: 'account' not 'accounts'
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable("verification", {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date())
});

export const linkTable = sqliteTable("link", {
    id: text("id").primaryKey(),
    original_url: text("original_url").notNull(),
    short_slug: text("short_slug").notNull(),
    click_count: integer("click_count").notNull().default(0),
    createdby: text("createdby").references(() => userTable.id).notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    expireAt: text("expires_at").default(sql`CURRENT_TIMESTAMP`),
    password_hash: text("password_hash")
})


export const visitTable = sqliteTable("visit", {
    id: text("id").primaryKey(),
    link_id: text("link_id").references(() => linkTable.id).notNull(),
    ip_address: text("ip_address").notNull(),
    user_agent: text("user_agent").notNull(),
    referrer: text("referrer").notNull(),
    country: text("country").notNull(),
    clickedAt: text("clicked_at").default(sql`CURRENT_TIMESTAMP`),
});
