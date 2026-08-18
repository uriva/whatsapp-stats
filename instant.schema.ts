import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    snapshots: i.entity({
      title: i.string().indexed(),
      shareCode: i.string().unique().indexed(),
      inviterName: i.string(),
      inviteMessage: i.string().optional(),
      dataJson: i.string(),
      createdAt: i.number().indexed(),
      views: i.number().optional(),
    }),
    reactions: i.entity({
      emoji: i.string(),
      authorName: i.string(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {
    snapshotReactions: {
      forward: { on: "reactions", has: "one", label: "snapshot", onDelete: "cascade" },
      reverse: { on: "snapshots", has: "many", label: "reactions" },
    },
  },
});

type _AppSchema = typeof _schema;
export interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export default schema;
