import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';


export const userTable = sqliteTable('user', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    hashedPassword: text('hashedPassword').notNull(),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
}, table => {
    return {
        emailIndex: uniqueIndex("emailIndex").on(table.email),
    }
})

export const linkTable = sqliteTable("link", {
    id: text("id").primaryKey(),
    original_url: text("original_url").notNull(),
    short_slug: text("short_slug").notNull(),
    click_count: integer("click_count").notNull().default(0),
    createdby: text("createdby").references(() => userTable.id).notNull(),
    createdAt: text("created_at").default('CURRENT_TIMESTAMP'),
    updatedAt: text("updated_at").default('CURRENT_TIMESTAMP'),
    expireAt: text("expire_at").default('CURRENT_TIMESTAMP'),
    password_hash: text("password_hash")
})


export const visitTable = sqliteTable("visit", {
    id: text("id").primaryKey(),
    link_id: text("link_id").references(() => linkTable.id).notNull(),
    ip_address: text("ip_address").notNull(),
    user_agent: text("user_agent").notNull(),
    referrer: text("referrer").notNull(),
    country: text("country").notNull(),
    clickedAt: text("created_at").default('CURRENT_TIMESTAMP'),
})
