import { BaseEdgeMetadata } from "@/features/canvas/components/edges/types/base-edge";
import { defineRelations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  varchar,
  doublePrecision,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const executionStatusEnum = pgEnum("execution_status", [
  "pending",
  "running",
  "success",
  "error",
  "cancelled",
]);

export const executionNodeStatusEnum = pgEnum("execution_node_status", [
  "pending",
  "running",
  "success",
  "error",
  "skipped",
]);

export const executionsTable = pgTable(
  "executions_table",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    workflowId: uuid("workflow_id")
      .notNull()
      .references(() => workflowsTable.id, {
        onDelete: "cascade",
      }),

    status: executionStatusEnum("status").notNull().default("pending"),

    input: jsonb("input").$type<unknown>().default(null),

    output: jsonb("output").$type<unknown>().default(null),

    error: text("error"),

    startedAt: timestamp("started_at", {
      withTimezone: true,
    }),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("execution_workflow_id_idx").on(table.workflowId),
    index("execution_status_idx").on(table.status),
  ],
);

export const executionNodesTable = pgTable(
  "execution_nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    executionId: uuid("execution_id")
      .notNull()
      .references(() => executionsTable.id, {
        onDelete: "cascade",
      }),

    nodeId: uuid("node_id").notNull(),

    nodeType: text("node_type").notNull(),

    nodeTitle: text("node_title").notNull(),

    status: varchar("status", {
      enum: ["pending", "running", "success", "error", "skipped"],
      length: 20,
    })
      .notNull()
      .default("pending"),

    input: jsonb("input").$type<Record<string, unknown> | null>().default(null),

    output: jsonb("output")
      .$type<Record<string, unknown> | null>()
      .default(null),

    error: text("error"),

    startedAt: timestamp("started_at", {
      withTimezone: true,
    }),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),

    duration: doublePrecision("duration"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("execution_nodes_execution_id_idx").on(table.executionId),

    index("execution_nodes_node_id_idx").on(table.nodeId),

    index("execution_nodes_status_idx").on(table.status),
  ],
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const projectsTable = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  description: text("description"),

  icon: varchar("icon", { length: 255 }),

  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  visibility: varchar("visibility", {
    enum: ["private", "team", "public"],
    length: 20,
  })
    .default("private")
    .notNull(),

  archived: boolean("archived").default(false).notNull(),

  svixAppId: text("svix_app_id"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const workflowsTable = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, {
      onDelete: "cascade",
    }),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  description: text("description"),

  isEntryPoint: boolean("is_entry_point").notNull().default(false),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const nodesTable = pgTable("nodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  workflowId: uuid("workflow_id")
    .references(() => workflowsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),

  type: text("type").notNull(),

  title: text("title").notNull(),

  description: text("description"),

  positionX: doublePrecision("position_x").notNull(),

  positionY: doublePrecision("position_y").notNull(),

  config: jsonb("config").$type<Record<string, unknown>>().notNull(),

  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const edgesTable = pgTable("edges", {
  id: uuid("id").primaryKey().defaultRandom(),

  workflowId: uuid("workflow_id")
    .references(() => workflowsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),

  source: text("source").notNull(),

  target: text("target").notNull(),

  sourceHandle: text("source_handle"),

  targetHandle: text("target_handle"),

  config: jsonb("config").$type<Record<string, unknown>>().notNull(),

  metadata: jsonb("metadata").$type<BaseEdgeMetadata>().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const relations = defineRelations(
  {
    user,
    session,
    account,
    verification,
    projectsTable,
    workflowsTable,
    nodesTable,
    edgesTable,
    executionsTable,
    executionNodesTable,
  },
  (r) => ({
    user: {
      sessions: r.many.session({
        from: r.user.id,
        to: r.session.userId,
      }),
      accounts: r.many.account({
        from: r.user.id,
        to: r.account.userId,
      }),
      projects: r.many.projectsTable({
        from: r.user.id,
        to: r.projectsTable.ownerId,
      }),
    },

    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
        optional: false,
      }),
    },

    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
        optional: false,
      }),
    },

    projects: {
      owner: r.one.user({
        from: r.projectsTable.ownerId,
        to: r.user.id,
        optional: false,
      }),
      workflows: r.many.projectsTable({
        from: r.projectsTable.id,
        to: r.workflowsTable.projectId,
      }),
    },

    workflows: {
      project: r.one.projectsTable({
        from: r.workflowsTable.projectId,
        to: r.projectsTable.id,
        optional: false,
      }),
      nodes: r.many.nodesTable({
        from: r.workflowsTable.id,
        to: r.nodesTable.workflowId,
      }),

      edges: r.many.edgesTable({
        from: r.workflowsTable.id,
        to: r.edgesTable.workflowId,
      }),
      executions: r.many.executionsTable({
        from: r.workflowsTable.id,
        to: r.executionsTable.workflowId,
      }),
    },

    nodes: {
      workflow: r.one.workflowsTable({
        from: r.nodesTable.workflowId,
        to: r.workflowsTable.id,
        optional: false,
      }),

      executions: r.many.executionNodesTable({
        from: r.nodesTable.id,
        to: r.executionNodesTable.nodeId,
      }),
    },

    executions: {
      workflow: r.one.workflowsTable({
        from: r.executionsTable.workflowId,
        to: r.workflowsTable.id,
        optional: false,
      }),

      nodes: r.many.executionNodesTable({
        from: r.executionsTable.id,
        to: r.executionNodesTable.executionId,
      }),
    },

    executionNodes: {
      execution: r.one.executionsTable({
        from: r.executionNodesTable.executionId,
        to: r.executionsTable.id,
        optional: false,
      }),

      node: r.one.nodesTable({
        from: r.executionNodesTable.nodeId,
        to: r.nodesTable.id,
        optional: false,
      }),
    },
  }),
);
