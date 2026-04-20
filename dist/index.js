var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/adapter/index.ts
import {
  createDatabaseAdapter
} from "payload";

// src/adapter/service.ts
import { anyApi } from "convex/server";

// src/convex/queries.ts
import {
  queryGeneric
} from "convex/server";
import { v } from "convex/values";
function convexGetById(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      id: v.optional(v.string())
    },
    handler: async (ctx, args) => {
      if (!args.id) {
        service.system.logger("No ID provided for getById operation").warn();
        return null;
      }
      const doc = await ctx.db.get(args.id);
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        convex: true
      });
      const result = doc ? processor.toPayload(doc) : null;
      service.system.logger({
        fn: "getById",
        props: { collection: args.collection, id: args.id },
        result
      }).log();
      return result;
    }
  });
}
async function adapterGetById(props) {
  const { service, collection, id } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    convex: false
  });
  const query = await client.query(api.adapter.getById, {
    collection: processor.convexQueryProps.collection,
    id
  });
  return query;
}
var getById = {
  adapter: adapterGetById,
  convex: convexGetById
};
function convexCollectionQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        index: args.index,
        convex: true
      });
      const query = await processor.query().toPayload();
      service.system.logger({
        fn: "collectionQuery",
        props: { collection: args.collection, index: args.index },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionQuery(props) {
  const { service, collection, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(api.adapter.collectionQuery, {
    collection: processor.convexQueryProps.collection,
    index: processor.convexQueryProps.index
  });
  return query;
}
var collectionQuery = {
  adapter: adapterCollectionQuery,
  convex: convexCollectionQuery
};
function convexCollectionCountQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      wherePlan: v.optional(v.any()),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        index: args.index,
        convex: true
      });
      const data = await processor.query().postFilter().collect();
      const result = data.length;
      service.system.logger({
        fn: "collectionCountQuery",
        props: { collection: args.collection, wherePlan: args.wherePlan },
        result
      }).log();
      return result;
    }
  });
}
async function adapterCollectionCountQuery(props) {
  const { service, collection, wherePlan, index } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    index,
    convex: false
  });
  const query = await client.query(api.adapter.collectionCountQuery, {
    collection: processor.convexQueryProps.collection,
    wherePlan: processor.convexQueryProps.wherePlan,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionCountQuery = {
  adapter: adapterCollectionCountQuery,
  convex: convexCollectionCountQuery
};
function convexCollectionWhereQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      wherePlan: v.optional(v.any()),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        index: args.index,
        convex: true
      });
      const query = await processor.query().postFilter().toPayload();
      service.system.logger({
        fn: "collectionWhereQuery",
        props: { collection: args.collection, wherePlan: args.wherePlan },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionWhereQuery(props) {
  const { service, collection, wherePlan, index } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    index,
    convex: false
  });
  const query = await client.query(api.adapter.collectionWhereQuery, {
    collection: processor.convexQueryProps.collection,
    wherePlan: processor.convexQueryProps.wherePlan,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionWhereQuery = {
  adapter: adapterCollectionWhereQuery,
  convex: convexCollectionWhereQuery
};
function convexCollectionOrderQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      order: v.union(v.literal("asc"), v.literal("desc")),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        index: args.index,
        convex: true
      });
      const query = await processor.query().order(args.order).toPayload();
      service.system.logger({
        fn: "collectionOrderQuery",
        props: { collection: args.collection, order: args.order },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionOrderQuery(props) {
  const { service, collection, order, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    order,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(api.adapter.collectionOrderQuery, {
    collection: processor.convexQueryProps.collection,
    order: processor.convexQueryProps.order,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionOrderQuery = {
  adapter: adapterCollectionOrderQuery,
  convex: convexCollectionOrderQuery
};
function convexCollectionOrderLimitQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      order: v.union(v.literal("asc"), v.literal("desc")),
      limit: v.number(),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        index: args.index,
        convex: true
      });
      const query = await processor.query().order(args.order).take(args.limit).toPayload();
      service.system.logger({
        fn: "collectionOrderLimitQuery",
        props: { collection: args.collection, order: args.order, limit: args.limit },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionOrderLimitQuery(props) {
  const { service, collection, order, limit, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    limit,
    sort: order === "desc" ? "-createdAt" : "createdAt",
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(api.adapter.collectionOrderLimitQuery, {
    collection: processor.convexQueryProps.collection,
    order: processor.convexQueryProps.order,
    limit: processor.convexQueryProps.limit,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionOrderLimitQuery = {
  adapter: adapterCollectionOrderLimitQuery,
  convex: convexCollectionOrderLimitQuery
};
function convexCollectionOrderPaginateQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      order: v.union(v.literal("asc"), v.literal("desc")),
      paginationOpts: v.object({
        numItems: v.number(),
        cursor: v.union(v.string(), v.null())
      }),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        index: args.index,
        convex: true
      });
      const query = await processor.query().order(args.order).paginate(args.paginationOpts).toPayload();
      service.system.logger({
        fn: "collectionOrderPaginateQuery",
        props: { collection: args.collection, order: args.order, paginationOpts: args.paginationOpts },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionOrderPaginateQuery(props) {
  const { service, collection, order, paginationOpts, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    sort: order === "desc" ? "-createdAt" : "createdAt",
    pagination: true,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(api.adapter.collectionOrderPaginateQuery, {
    collection: processor.convexQueryProps.collection,
    order: processor.convexQueryProps.order,
    paginationOpts,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionOrderPaginateQuery = {
  adapter: adapterCollectionOrderPaginateQuery,
  convex: convexCollectionOrderPaginateQuery
};
function convexCollectionLimitQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      limit: v.number(),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        index: args.index,
        convex: true
      });
      const query = await processor.query().take(args.limit).toPayload();
      service.system.logger({
        fn: "collectionLimitQuery",
        props: { collection: args.collection, limit: args.limit },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionLimitQuery(props) {
  const { service, collection, limit, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    limit,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(api.adapter.collectionLimitQuery, {
    collection: processor.convexQueryProps.collection,
    limit: processor.convexQueryProps.limit,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionLimitQuery = {
  adapter: adapterCollectionLimitQuery,
  convex: convexCollectionLimitQuery
};
function convexCollectionWhereOrderQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      wherePlan: v.optional(v.any()),
      order: v.union(v.literal("asc"), v.literal("desc")),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        wherePlan: args.wherePlan,
        collection: args.collection,
        index: args.index,
        convex: true
      });
      const query = await processor.query().order(args.order).postFilter().toPayload();
      service.system.logger({
        fn: "collectionWhereOrderQuery",
        props: { collection: args.collection, wherePlan: args.wherePlan, order: args.order },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionWhereOrderQuery(props) {
  const { service, collection, wherePlan, order, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    order,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(
    api.adapter.collectionWhereOrderQuery,
    processor.convexQueryProps
  );
  return query;
}
var collectionWhereOrderQuery = {
  adapter: adapterCollectionWhereOrderQuery,
  convex: convexCollectionWhereOrderQuery
};
function convexCollectionWhereLimitQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      wherePlan: v.optional(v.any()),
      limit: v.number(),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        index: args.index,
        convex: true
      });
      const query = await processor.query().take(args.limit).postFilter().toPayload();
      service.system.logger({
        fn: "collectionWhereLimitQuery",
        props: { collection: args.collection, wherePlan: args.wherePlan, limit: args.limit },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionWhereLimitQuery(props) {
  const { service, collection, wherePlan, limit, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    limit,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(api.adapter.collectionWhereLimitQuery, {
    collection: processor.convexQueryProps.collection,
    wherePlan: processor.convexQueryProps.wherePlan,
    limit: processor.convexQueryProps.limit,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionWhereLimitQuery = {
  adapter: adapterCollectionWhereLimitQuery,
  convex: convexCollectionWhereLimitQuery
};
function convexCollectionWherePaginateQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      wherePlan: v.optional(v.any()),
      paginationOpts: v.object({
        numItems: v.number(),
        cursor: v.union(v.string(), v.null())
      }),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        index: args.index,
        convex: true
      });
      const query = await processor.query().paginate(args.paginationOpts).postFilter().toPayload();
      service.system.logger({
        fn: "collectionWherePaginateQuery",
        props: { collection: args.collection, wherePlan: args.wherePlan, paginationOpts: args.paginationOpts },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionWherePaginateQuery(props) {
  const { service, collection, wherePlan, paginationOpts, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    pagination: true,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(api.adapter.collectionWherePaginateQuery, {
    collection: processor.convexQueryProps.collection,
    wherePlan: processor.convexQueryProps.wherePlan,
    paginationOpts,
    index: processor.convexQueryProps.index ?? void 0
  });
  return query;
}
var collectionWherePaginateQuery = {
  adapter: adapterCollectionWherePaginateQuery,
  convex: convexCollectionWherePaginateQuery
};
function convexCollectionWhereOrderLimitQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      wherePlan: v.optional(v.any()),
      order: v.union(v.literal("asc"), v.literal("desc")),
      limit: v.number(),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        index: args.index,
        convex: true
      });
      const query = await processor.query().order(args.order).take(args.limit).postFilter().toPayload();
      service.system.logger({
        fn: "collectionWhereOrderLimitQuery",
        props: { collection: args.collection, wherePlan: args.wherePlan, order: args.order, limit: args.limit },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionWhereOrderLimitQuery(props) {
  const { service, collection, wherePlan, order, limit, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    limit,
    sort: order === "desc" ? "-createdAt" : "createdAt",
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(
    api.adapter.collectionWhereOrderLimitQuery,
    {
      collection: processor.convexQueryProps.collection,
      wherePlan: processor.convexQueryProps.wherePlan,
      order: processor.convexQueryProps.order,
      limit: processor.convexQueryProps.limit,
      index: processor.convexQueryProps.index ?? void 0
    }
  );
  return query;
}
var collectionWhereOrderLimitQuery = {
  adapter: adapterCollectionWhereOrderLimitQuery,
  convex: convexCollectionWhereOrderLimitQuery
};
function convexCollectionWhereOrderPaginateQuery(props) {
  const { service } = props;
  return queryGeneric({
    args: {
      collection: v.string(),
      wherePlan: v.optional(v.any()),
      order: v.union(v.literal("asc"), v.literal("desc")),
      paginationOpts: v.object({
        numItems: v.number(),
        cursor: v.union(v.string(), v.null())
      }),
      index: v.optional(
        v.union(
          v.object({
            indexName: v.string(),
            indexRange: v.optional(v.any())
          }),
          v.null()
        )
      )
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        index: args.index,
        convex: true
      });
      const query = await processor.query().order(args.order).paginate(args.paginationOpts).postFilter().toPayload();
      service.system.logger({
        fn: "collectionWhereOrderPaginateQuery",
        props: { collection: args.collection, wherePlan: args.wherePlan, order: args.order, paginationOpts: args.paginationOpts },
        result: query
      }).log();
      return query;
    }
  });
}
async function adapterCollectionWhereOrderPaginateQuery(props) {
  const { service, collection, wherePlan, order, paginationOpts, index } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    sort: order === "desc" ? "-createdAt" : "createdAt",
    pagination: true,
    index,
    convex: false
  });
  const client = service.db.client.directClient;
  const api = service.db.api;
  const query = await client.query(
    api.adapter.collectionWhereOrderPaginateQuery,
    {
      collection: processor.convexQueryProps.collection,
      wherePlan: processor.convexQueryProps.wherePlan,
      order: processor.convexQueryProps.order,
      paginationOpts,
      index: processor.convexQueryProps.index ?? void 0
    }
  );
  return query;
}
var collectionWhereOrderPaginateQuery = {
  adapter: adapterCollectionWhereOrderPaginateQuery,
  convex: convexCollectionWhereOrderPaginateQuery
};
function QueryAdapter(props) {
  return {
    getById,
    collectionQuery,
    collectionCountQuery,
    // Where-based queries (use ParsedWhereFilter)
    collectionWhereQuery,
    collectionWhereOrderQuery,
    collectionWhereLimitQuery,
    collectionWherePaginateQuery,
    collectionWhereOrderLimitQuery,
    collectionWhereOrderPaginateQuery,
    // Non-filter queries
    collectionOrderQuery,
    collectionOrderLimitQuery,
    collectionOrderPaginateQuery,
    collectionLimitQuery
  };
}

// src/convex/mutations.ts
import {
  mutationGeneric
} from "convex/server";
import { v as v2 } from "convex/values";
function convexInsert(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      collection: v2.string(),
      data: v2.any()
    },
    handler: async (ctx, args) => {
      const insertableData = {};
      for (const [key, value] of Object.entries(args.data)) {
        if (key === "_id" || key === "_creationTime") {
          continue;
        }
        insertableData[key] = value;
      }
      const result = await ctx.db.insert(
        args.collection,
        insertableData
      );
      service.system.logger({
        fn: "insert",
        props: { collection: args.collection, data: insertableData },
        result
      }).log();
      return result;
    }
  });
}
async function adapterInsert(props) {
  const { service, collection, data } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    data,
    convex: false
  });
  const compiledData = processor.convexQueryProps.data;
  const insertableData = {};
  for (const [key, value] of Object.entries(compiledData)) {
    if (key === "_id" || key === "_creationTime") {
      continue;
    }
    insertableData[key] = value;
  }
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.insert, {
    collection: processor.convexQueryProps.collection,
    data: insertableData
  });
  return result;
}
var insert = {
  adapter: adapterInsert,
  convex: convexInsert
};
function convexGetByIdMutation(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      collection: v2.string(),
      id: v2.string()
    },
    handler: async (ctx, args) => {
      const doc = await ctx.db.get(args.collection, args.id);
      if (!doc) {
        service.system.logger({
          fn: "getByIdMutation",
          props: { collection: args.collection, id: args.id },
          result: null
        }).log();
        return null;
      }
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        convex: true
      });
      const result = processor.toPayload(doc);
      service.system.logger({
        fn: "getByIdMutation",
        props: { collection: args.collection, id: args.id },
        result
      }).log();
      return result;
    }
  });
}
async function adapterGetByIdMutation(props) {
  const { service, collection, id } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const collectionId = service.tools.parseCollection({
    prefix: service.system.prefix,
    collection
  });
  const result = await client.mutation(api.adapter.getByIdMutation, {
    collection: collectionId,
    id
  });
  return result;
}
var getByIdMutation = {
  adapter: adapterGetByIdMutation,
  convex: convexGetByIdMutation
};
function convexPatch(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      id: v2.optional(v2.string()),
      data: v2.any()
    },
    handler: async (ctx, args) => {
      if (!args.id) {
        service.system.logger("No ID provided for patch operation - cancelling operation").warn();
        return null;
      }
      await ctx.db.patch(args.id, args.data);
      service.system.logger({
        fn: "patch",
        props: { id: args.id, data: args.data },
        result: "success"
      }).log();
      return null;
    }
  });
}
async function adapterPatch(props) {
  const { service, id, data } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection: "_temp",
    // Placeholder - not used for data transformation
    data,
    convex: false
  });
  const compiledData = processor.convexQueryProps.data;
  const patchableData = {};
  for (const [key, value] of Object.entries(compiledData)) {
    if (key === "_id" || key === "_creationTime") {
      continue;
    }
    patchableData[key] = value;
  }
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.patch, {
    id,
    data: patchableData
  });
  return result;
}
var patch = {
  adapter: adapterPatch,
  convex: convexPatch
};
function convexReplace(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      id: v2.string(),
      data: v2.any()
    },
    handler: async (ctx, args) => {
      await ctx.db.replace(args.id, args.data);
      service.system.logger({
        fn: "replace",
        props: { id: args.id, data: args.data },
        result: "success"
      }).log();
      return null;
    }
  });
}
async function adapterReplace(props) {
  const { service, id, data } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection: "_temp",
    // Placeholder - not used for data transformation
    data,
    convex: false
  });
  const compiledData = processor.convexQueryProps.data;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.replace, {
    id,
    data: compiledData
  });
  return result;
}
var replace = {
  adapter: adapterReplace,
  convex: convexReplace
};
function convexDeleteOp(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      id: v2.string()
    },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
      service.system.logger({
        fn: "delete",
        props: { id: args.id },
        result: "success"
      }).log();
      return null;
    }
  });
}
async function adapterDeleteOp(props) {
  const { service, id } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.deleteOp, {
    id
  });
  return result;
}
var deleteOp = {
  adapter: adapterDeleteOp,
  convex: convexDeleteOp
};
function convexUpsert(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      collection: v2.string(),
      id: v2.optional(v2.string()),
      data: v2.any()
    },
    handler: async (ctx, args) => {
      const upsertableData = {};
      for (const [key, value] of Object.entries(args.data)) {
        if (key === "_id" || key === "_creationTime") {
          continue;
        }
        upsertableData[key] = value;
      }
      let docId;
      let wasUpdate = false;
      if (args.id) {
        const existing = await ctx.db.get(args.id);
        if (existing) {
          await ctx.db.patch(args.id, upsertableData);
          docId = args.id;
          wasUpdate = true;
        } else {
          docId = await ctx.db.insert(args.collection, upsertableData);
        }
      } else {
        docId = await ctx.db.insert(args.collection, upsertableData);
      }
      service.system.logger({
        fn: "upsert",
        props: { collection: args.collection, id: args.id, data: upsertableData },
        result: { docId, wasUpdate }
      }).log();
      return docId;
    }
  });
}
async function adapterUpsert(props) {
  const { service, collection, id, data } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    data,
    convex: false
  });
  const compiledData = processor.convexQueryProps.data;
  const upsertableData = {};
  for (const [key, value] of Object.entries(compiledData)) {
    if (key === "_id" || key === "_creationTime") {
      continue;
    }
    upsertableData[key] = value;
  }
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.upsert, {
    collection: processor.convexQueryProps.collection,
    id,
    data: upsertableData
  });
  return result;
}
var upsert = {
  adapter: adapterUpsert,
  convex: convexUpsert
};
function convexUpdateManyWhere(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      collection: v2.string(),
      wherePlan: v2.optional(v2.any()),
      data: v2.any()
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        convex: true
      });
      const docs = await processor.query().postFilter().collect();
      await Promise.all(
        docs.map((doc) => ctx.db.patch(doc._id, args.data))
      );
      service.system.logger({
        fn: "updateManyWhere",
        props: { collection: args.collection, wherePlan: args.wherePlan, data: args.data },
        result: { docsUpdated: docs.length }
      }).log();
      return docs.length;
    }
  });
}
async function adapterUpdateManyWhere(props) {
  const { service, collection, wherePlan, data } = props;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    data,
    convex: false
  });
  const compiledData = processor.convexQueryProps.data;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.updateManyWhere, {
    collection: processor.convexQueryProps.collection,
    wherePlan: processor.convexQueryProps.wherePlan,
    data: processor.convexQueryProps.data
  });
  return result;
}
var updateManyWhere = {
  adapter: adapterUpdateManyWhere,
  convex: convexUpdateManyWhere
};
function convexDeleteManyWhere(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      collection: v2.string(),
      wherePlan: v2.optional(v2.any())
    },
    handler: async (ctx, args) => {
      const processor = service.tools.queryProcessor({
        ctx,
        service,
        collection: args.collection,
        wherePlan: args.wherePlan,
        convex: true
      });
      const docs = await processor.query().postFilter().collect();
      await Promise.all(docs.map((doc) => ctx.db.delete(doc._id)));
      service.system.logger({
        fn: "deleteManyWhere",
        props: { collection: args.collection, wherePlan: args.wherePlan },
        result: { docsDeleted: docs.length }
      }).log();
      return docs.length;
    }
  });
}
async function adapterDeleteManyWhere(props) {
  const { service, collection, wherePlan } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const processor = service.tools.queryProcessor({
    service,
    collection,
    wherePlan,
    convex: false
  });
  const result = await client.mutation(api.adapter.deleteManyWhere, {
    collection: processor.convexQueryProps.collection,
    wherePlan: processor.convexQueryProps.wherePlan
  });
  return result;
}
var deleteManyWhere = {
  adapter: adapterDeleteManyWhere,
  convex: convexDeleteManyWhere
};
function normalizeFieldToConvex(field) {
  const normalizeSegment = (segment) => {
    if (segment === "id") return "_id";
    if (segment === "createdAt") return "_creationTime";
    if (segment === "_id" || segment === "_creationTime" || segment === "_updatedTime") {
      return segment;
    }
    if (segment.startsWith("pca_")) {
      return segment;
    }
    if (segment.startsWith("_") || segment.startsWith("$")) {
      return `pca_${segment}`;
    }
    return segment;
  };
  if (field.includes(".")) {
    return field.split(".").map(normalizeSegment).join(".");
  }
  return normalizeSegment(field);
}
function convexIncrement(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      id: v2.string(),
      field: v2.string(),
      amount: v2.number()
    },
    handler: async (ctx, args) => {
      const doc = await ctx.db.get(args.id);
      if (!doc) {
        service.system.logger({
          fn: "increment",
          props: { id: args.id, field: args.field, amount: args.amount },
          error: "Document not found"
        }).log();
        return null;
      }
      const convexField = normalizeFieldToConvex(args.field);
      const currentValue = doc[convexField] ?? 0;
      const newValue = currentValue + args.amount;
      await ctx.db.patch(args.id, {
        [convexField]: newValue
      });
      service.system.logger({
        fn: "increment",
        props: { id: args.id, field: args.field, amount: args.amount },
        result: { previousValue: currentValue, newValue }
      }).log();
      return { newValue };
    }
  });
}
async function adapterIncrement(props) {
  const { service, id, field, amount } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.increment, {
    id,
    field,
    amount
  });
  return result;
}
var increment = {
  adapter: adapterIncrement,
  convex: convexIncrement
};
function convexTransactional(props) {
  const { service } = props;
  return mutationGeneric({
    args: {
      run: v2.any()
    },
    handler: async (ctx, args) => {
      const result = await args.run(ctx);
      const safeResult = result === void 0 ? null : result;
      service.system.logger({
        fn: "transactional",
        props: {},
        result: safeResult
      }).log();
      return safeResult;
    }
  });
}
async function adapterTransactional(props) {
  const { service, run } = props;
  const client = service.db.client.directClient;
  const api = service.db.api;
  const result = await client.mutation(api.adapter.transactional, {
    run
  });
  return result;
}
var transactional = {
  adapter: adapterTransactional,
  convex: convexTransactional
};
function MutationAdapter(props) {
  return {
    insert,
    getByIdMutation,
    patch,
    replace,
    deleteOp,
    upsert,
    // Where-based mutations (use ParsedWhereFilter)
    updateManyWhere,
    deleteManyWhere,
    // Other mutations
    increment,
    transactional
  };
}

// src/convex/client.ts
import { ConvexHttpClient, ConvexClient } from "convex/browser";
function createConvexClient(props) {
  const { convexUrl } = props;
  const directClient = new ConvexHttpClient(convexUrl);
  const liveClient = new ConvexClient(convexUrl);
  return {
    directClient,
    liveClient
  };
}

// src/tools/is-client.ts
var isClient = typeof window !== "undefined";

// src/tools/is-dev.ts
var isDev = process.env.NODE_ENV === "development";

// src/tools/parse-collection.ts
function parseCollection(props) {
  const { prefix, collection } = props;
  if (collection.startsWith(`${prefix}_`)) {
    return collection;
  }
  const sanitizedCollection = collection.replace(/-/g, "_");
  return `${prefix}_${sanitizedCollection}`;
}

// src/tools/query-processor.ts
function classifyComparison(comparison) {
  if (comparison.field.includes(".")) {
    return false;
  }
  const unsupportedOps = ["contains", "like", "near"];
  if (unsupportedOps.includes(comparison.operator)) {
    return false;
  }
  return true;
}
function classifyWhereNode(node) {
  switch (node.type) {
    case "comparison":
      return classifyComparison(node.comparison);
    case "and":
    case "or":
      return node.nodes.every(classifyWhereNode);
    case "not":
      return classifyWhereNode(node.node);
  }
}
function splitWhereNode(node) {
  if (classifyWhereNode(node)) {
    return { dbFilter: node, postFilter: null };
  }
  if (node.type === "comparison") {
    return { dbFilter: null, postFilter: node };
  }
  if (node.type === "not") {
    return { dbFilter: null, postFilter: node };
  }
  if (node.type === "and") {
    const dbNodes = [];
    const postNodes = [];
    for (const child of node.nodes) {
      if (classifyWhereNode(child)) {
        dbNodes.push(child);
      } else {
        postNodes.push(child);
      }
    }
    return {
      dbFilter: dbNodes.length > 0 ? dbNodes.length === 1 ? dbNodes[0] : { type: "and", nodes: dbNodes } : null,
      postFilter: postNodes.length > 0 ? postNodes.length === 1 ? postNodes[0] : { type: "and", nodes: postNodes } : null
    };
  }
  if (node.type === "or") {
    const allDbCompatible = node.nodes.every(classifyWhereNode);
    if (allDbCompatible) {
      return { dbFilter: node, postFilter: null };
    }
    return { dbFilter: null, postFilter: node };
  }
  return { dbFilter: null, postFilter: node };
}
function transformComparisonFieldsToConvex(comparison) {
  return {
    ...comparison,
    field: normalizeField(comparison.field)
  };
}
function transformWhereNodeToConvex(node) {
  switch (node.type) {
    case "comparison":
      return {
        type: "comparison",
        comparison: transformComparisonFieldsToConvex(node.comparison)
      };
    case "and":
      return {
        type: "and",
        nodes: node.nodes.map(transformWhereNodeToConvex)
      };
    case "or":
      return {
        type: "or",
        nodes: node.nodes.map(transformWhereNodeToConvex)
      };
    case "not":
      return {
        type: "not",
        node: transformWhereNodeToConvex(node.node)
      };
  }
}
function transformWherePlanToConvex(plan) {
  return {
    strategy: plan.strategy,
    dbFilter: plan.dbFilter ? transformWhereNodeToConvex(plan.dbFilter) : null,
    postFilter: plan.postFilter ? transformWhereNodeToConvex(plan.postFilter) : null
  };
}
function convertNodeLteToLt(node, fieldName) {
  switch (node.type) {
    case "comparison":
      if (node.comparison.field === fieldName && node.comparison.operator === "less_than_equal") {
        return {
          type: "comparison",
          comparison: {
            ...node.comparison,
            operator: "less_than"
          }
        };
      }
      return node;
    case "and":
      return {
        type: "and",
        nodes: node.nodes.map((n) => convertNodeLteToLt(n, fieldName))
      };
    case "or":
      return {
        type: "or",
        nodes: node.nodes.map((n) => convertNodeLteToLt(n, fieldName))
      };
    case "not":
      return {
        type: "not",
        node: convertNodeLteToLt(node.node, fieldName)
      };
    default:
      return node;
  }
}
function convertLteToLtForUpdatedAt(wherePlan) {
  return {
    strategy: wherePlan.strategy,
    dbFilter: wherePlan.dbFilter ? convertNodeLteToLt(wherePlan.dbFilter, "updatedAt") : null,
    postFilter: wherePlan.postFilter ? convertNodeLteToLt(wherePlan.postFilter, "updatedAt") : null
  };
}
function addVersionIdExclusion(wherePlan, excludeId) {
  const exclusionNode = {
    type: "comparison",
    comparison: {
      field: "_id",
      operator: "not_equals",
      value: excludeId
    }
  };
  const newDbFilter = wherePlan.dbFilter ? { type: "and", nodes: [wherePlan.dbFilter, exclusionNode] } : exclusionNode;
  return {
    strategy: wherePlan.strategy === "post" ? "hybrid" : wherePlan.strategy,
    dbFilter: newDbFilter,
    postFilter: wherePlan.postFilter
  };
}
function addPublishedVersionExclusion(wherePlan) {
  const publishedExclusionNode = {
    type: "comparison",
    comparison: {
      field: "version._status",
      operator: "not_equals",
      value: "published"
    }
  };
  const newPostFilter = wherePlan.postFilter ? {
    type: "and",
    nodes: [wherePlan.postFilter, publishedExclusionNode]
  } : publishedExclusionNode;
  return {
    strategy: wherePlan.strategy === "db" ? "hybrid" : wherePlan.strategy,
    dbFilter: wherePlan.dbFilter,
    postFilter: newPostFilter
  };
}
function parsePayloadWhere(where) {
  if (!where || Object.keys(where).length === 0) {
    return { strategy: "db", dbFilter: null, postFilter: null };
  }
  const parsedNode = parseWhereObject(where);
  if (!parsedNode) {
    return { strategy: "db", dbFilter: null, postFilter: null };
  }
  const { dbFilter, postFilter } = splitWhereNode(parsedNode);
  let strategy;
  if (dbFilter && !postFilter) {
    strategy = "db";
  } else if (!dbFilter && postFilter) {
    strategy = "post";
  } else {
    strategy = "hybrid";
  }
  return { strategy, dbFilter, postFilter };
}
function createWherePlan(props) {
  const { where } = props;
  const rawWherePlan = parsePayloadWhere(where ?? void 0);
  return transformWherePlanToConvex(rawWherePlan);
}
function emptyWherePlan() {
  return { strategy: "db", dbFilter: null, postFilter: null };
}
function parseWhereObject(where) {
  const nodes = [];
  if (Array.isArray(where.and)) {
    nodes.push({
      type: "and",
      nodes: where.and.map(parseWhereObject)
    });
  }
  if (Array.isArray(where.or)) {
    nodes.push({
      type: "or",
      nodes: where.or.map(parseWhereObject)
    });
  }
  if ("not" in where && where.not && typeof where.not === "object") {
    nodes.push({
      type: "not",
      node: parseWhereObject(where.not)
    });
  }
  for (const [field, value] of Object.entries(where)) {
    if (field === "and" || field === "or" || field === "not") continue;
    if (!value || typeof value !== "object") continue;
    const fieldConditions = parseWhereField(field, value);
    nodes.push(...fieldConditions);
  }
  if (nodes.length === 0) {
    return {
      type: "comparison",
      comparison: {
        field: "_id",
        operator: "exists",
        value: true
      }
    };
  }
  if (nodes.length === 1) return nodes[0];
  return { type: "and", nodes };
}
function convertDateValue(value) {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
  }
  return value;
}
function parseWhereField(field, fieldValue) {
  const nodes = [];
  for (const [operator, value] of Object.entries(fieldValue)) {
    nodes.push({
      type: "comparison",
      comparison: {
        field,
        operator,
        value: convertDateValue(value)
      }
    });
  }
  return nodes;
}
function buildConvexFilter(q, node) {
  if (!node) return true;
  return buildNode(q, node);
}
function buildNode(q, node) {
  switch (node.type) {
    case "and":
      if (node.nodes.length === 0) return true;
      if (node.nodes.length === 1) return buildNode(q, node.nodes[0]);
      return q.and(...node.nodes.map((n) => buildNode(q, n)));
    case "or":
      if (node.nodes.length === 0) return false;
      if (node.nodes.length === 1) return buildNode(q, node.nodes[0]);
      return q.or(...node.nodes.map((n) => buildNode(q, n)));
    case "not":
      return q.not(buildNode(q, node.node));
    case "comparison":
      return buildComparison(q, node.comparison);
  }
}
function normalizeFieldSegment(segment) {
  if (segment === "id") return "_id";
  if (segment === "createdAt") return "_creationTime";
  if (segment === "_id" || segment === "_creationTime" || segment === "_updatedTime") {
    return segment;
  }
  if (segment.startsWith("_") || segment.startsWith("$")) {
    return `pca_${segment}`;
  }
  return segment;
}
function normalizeField(field) {
  if (field.includes(".")) {
    return field;
  }
  return normalizeFieldSegment(field);
}
function buildComparison(q, cmp) {
  const field = q.field(normalizeField(cmp.field));
  switch (cmp.operator) {
    case "equals":
      return q.eq(field, cmp.value);
    case "not_equals":
      return q.neq(field, cmp.value);
    case "greater_than":
      return q.gt(field, cmp.value);
    case "greater_than_equal":
      return q.gte(field, cmp.value);
    case "less_than":
      return q.lt(field, cmp.value);
    case "less_than_equal":
      return q.lte(field, cmp.value);
    case "in": {
      if (!Array.isArray(cmp.value) || cmp.value.length === 0) {
        return false;
      }
      return q.or(...cmp.value.map((v3) => q.eq(field, v3)));
    }
    case "not_in": {
      if (!Array.isArray(cmp.value) || cmp.value.length === 0) {
        return true;
      }
      return q.and(...cmp.value.map((v3) => q.neq(field, v3)));
    }
    case "exists":
      if (cmp.value === true) {
        return q.and(q.neq(field, void 0), q.neq(field, null));
      }
      return q.or(q.eq(field, void 0), q.eq(field, null));
    case "contains":
    case "like":
    case "near":
      throw new Error(
        `Operator "${cmp.operator}" requires post-filtering or custom index. Field: ${cmp.field}, Value: ${JSON.stringify(cmp.value)}`
      );
    default:
      throw new Error(
        `Unsupported operator: ${cmp.operator} on field ${cmp.field}`
      );
  }
}
function getNestedValue(obj, path) {
  const parts = path.split(".");
  let current = obj;
  const normalize = parts.length === 1;
  for (const part of parts) {
    if (current === null || current === void 0) return void 0;
    const key = normalize ? normalizeFieldSegment(part) : part;
    current = current[key];
  }
  return current;
}
function evaluateComparison(doc, cmp) {
  const value = getNestedValue(doc, cmp.field);
  const compareValue = cmp.value;
  switch (cmp.operator) {
    case "equals":
      return value === compareValue;
    case "not_equals":
      return value !== compareValue;
    case "greater_than":
      return value > compareValue;
    case "greater_than_equal":
      return value >= compareValue;
    case "less_than":
      return value < compareValue;
    case "less_than_equal":
      return value <= compareValue;
    case "in":
      return Array.isArray(compareValue) && compareValue.includes(value);
    case "not_in":
      return Array.isArray(compareValue) && !compareValue.includes(value);
    case "exists":
      return compareValue ? value !== void 0 : value === void 0;
    case "contains":
      return typeof value === "string" && typeof compareValue === "string" && value.includes(compareValue);
    case "like":
      if (typeof value !== "string" || typeof compareValue !== "string")
        return false;
      const pattern = compareValue.replace(/%/g, ".*").replace(/_/g, ".");
      return new RegExp(`^${pattern}$`, "i").test(value);
    default:
      return true;
  }
}
function evaluateNode(doc, node) {
  switch (node.type) {
    case "and":
      return node.nodes.every((n) => evaluateNode(doc, n));
    case "or":
      return node.nodes.some((n) => evaluateNode(doc, n));
    case "not":
      return !evaluateNode(doc, node.node);
    case "comparison":
      return evaluateComparison(doc, node.comparison);
  }
}
function applyPostFilter(documents, postFilter, debug = false) {
  if (!postFilter) return documents;
  const result = documents.filter((doc) => {
    const passes = evaluateNode(doc, postFilter);
    return passes;
  });
  return result;
}
function applyWherePlan(baseQuery, wherePlan) {
  if (!wherePlan || !wherePlan.dbFilter) {
    return baseQuery;
  }
  return baseQuery.filter((q) => {
    const expr = buildConvexFilter(q, wherePlan.dbFilter);
    if (expr === true) return true;
    if (expr === false) return false;
    return expr;
  });
}
function applySortField(docs, sortField, order = "desc") {
  if (!sortField || sortField === "createdAt" || sortField === "id" || sortField === "_creationTime" || sortField === "_id") {
    return docs;
  }
  const sorted = [...docs].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}
var defaultKeyToConvex = (key) => {
  if (key === "id") return "_id";
  if (key === "createdAt") return "_creationTime";
  if (key === "_id" || key === "_creationTime" || key === "_updatedTime") {
    return key;
  }
  if (key.startsWith("_") || key.startsWith("$")) {
    return `pca_${key}`;
  }
  return key;
};
var defaultKeyToPayload = (key) => {
  if (key === "_creationTime") return "createdAt";
  if (key === "_id") return "_id";
  if (key === "_updatedTime") return "_updatedTime";
  if (key.startsWith("pca_")) {
    return key.replace("pca_", "");
  }
  return key;
};
function transformValueToConvex(value, key = "") {
  if (value === null || value === void 0) {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (Array.isArray(value)) {
    return value.filter((item) => item !== void 0).map((item, index) => transformValueToConvex(item, `${key}[${index}]`));
  }
  if (typeof value === "object") {
    const result = {};
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      result[nestedKey] = transformValueToConvex(
        nestedValue,
        `${key}.${nestedKey}`
      );
    }
    return result;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
  }
  return value;
}
function transformObjectToConvex(obj) {
  const result = {};
  for (const [originalKey, value] of Object.entries(obj)) {
    const transformedKey = defaultKeyToConvex(originalKey);
    const transformedValue = transformValueToConvex(value, transformedKey);
    result[transformedKey] = transformedValue;
  }
  return result;
}
var DATE_FIELD_SUFFIXES = [
  "At",
  // createdAt, updatedAt, publishedAt, deletedAt, expiresAt, etc.
  "Date",
  // startDate, endDate, birthDate, etc.
  "Time",
  // startTime, endTime, etc.
  "Timestamp"
  // loginTimestamp, etc.
];
function isDateField(key) {
  if (key === "_creationTime" || key === "_updatedTime" || key === "_id" || key === "id") {
    return false;
  }
  const lastSegment = key.includes(".") ? key.split(".").pop() : key;
  const lower = lastSegment.toLowerCase();
  return DATE_FIELD_SUFFIXES.some(
    (suffix) => lower.endsWith(suffix.toLowerCase())
  );
}
function transformValueToPayload(value, key = "") {
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value === "number" && isDateField(key)) {
    const year2000 = 9466848e5;
    const year2100 = 41024448e5;
    if (value >= year2000 && value <= year2100) {
      return new Date(value).toISOString();
    }
  }
  if (Array.isArray(value)) {
    return value.map(
      (item, index) => transformValueToPayload(item, `${key}[${index}]`)
    );
  }
  if (typeof value === "object" && !(value instanceof Date)) {
    const result = {};
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      result[nestedKey] = transformValueToPayload(
        nestedValue,
        `${key}.${nestedKey}`
      );
    }
    return result;
  }
  return value;
}
function transformObjectToPayload(obj) {
  const result = {};
  for (const [originalKey, value] of Object.entries(obj)) {
    const transformedKey = defaultKeyToPayload(originalKey);
    const transformedValue = transformValueToPayload(value, transformedKey);
    result[transformedKey] = transformedValue;
  }
  if (result._id !== void 0 && result._id !== null) {
    result.id = result._id;
  }
  return result;
}
function compileToConvex(data) {
  if (data === null || data === void 0) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((doc) => transformObjectToConvex(doc));
  }
  if (typeof data === "object") {
    return transformObjectToConvex(data);
  }
  return data;
}
function compileToPayload(data) {
  if (data === null || data === void 0) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((doc) => transformObjectToPayload(doc));
  }
  if (typeof data === "object") {
    return transformObjectToPayload(data);
  }
  return data;
}
function compilePaginatedToPayload(result) {
  return {
    ...result,
    page: result.page.map((doc) => transformObjectToPayload(doc))
  };
}
function normalizeConvexQuery(props) {
  const { ctx, service, collection, index } = props;
  const collectionId = service.tools.parseCollection({
    prefix: service.system.prefix,
    collection
  });
  if (index) {
    if (typeof index.indexRange === "function") {
      return ctx.db.query(collectionId).withIndex(index.indexName, index.indexRange);
    } else {
      return ctx.db.query(collectionId).withIndex(index.indexName, (q) => q);
    }
  }
  return ctx.db.query(collectionId);
}
function createAdapterQueryProcessor(props) {
  const {
    service,
    collection,
    where,
    wherePlan: inputWherePlan,
    data,
    limit,
    sort,
    order: inputOrder,
    pagination,
    page,
    index
  } = props;
  const collectionId = parseCollection({
    prefix: service.system.prefix,
    collection
  });
  const rawWherePlan = inputWherePlan || parsePayloadWhere(where);
  const wherePlan = transformWherePlanToConvex(rawWherePlan);
  const compiledData = data ? compileToConvex(data) : void 0;
  let sortField;
  const order = inputOrder || (typeof sort === "string" && sort.startsWith("-") ? "desc" : "asc");
  if (typeof sort === "string") {
    sortField = sort.startsWith("-") || sort.startsWith("+") ? sort.slice(1) : sort;
  } else if (Array.isArray(sort) && sort.length > 0) {
    const primary = sort[0];
    sortField = primary.startsWith("-") || primary.startsWith("+") ? primary.slice(1) : primary;
  }
  let paginationOpts;
  if (pagination && limit && page) {
    paginationOpts = {
      numItems: limit,
      cursor: null
      // TODO: Support cursor-based pagination
    };
  }
  const convexQueryProps = {
    collection: collectionId,
    wherePlan,
    data: compiledData,
    limit,
    order,
    sortField,
    paginationOpts,
    index
  };
  return {
    convexQueryProps,
    // Direct compilation methods
    compileToConvex(data2) {
      const compiled = compileToConvex(data2);
      return compiled ?? data2;
    },
    compileToPayload(data2) {
      const compiled = compileToPayload(data2);
      return compiled ?? data2;
    }
  };
}
function createQueryChain(state) {
  const chain = {
    filter() {
      if (state.wherePlan?.dbFilter) {
        state.baseQuery = applyWherePlan(state.baseQuery, state.wherePlan);
      }
      return chain;
    },
    postFilter() {
      state.shouldPostFilter = true;
      return chain;
    },
    order(direction) {
      state.orderDirection = direction;
      return chain;
    },
    take(n) {
      state.takeLimit = n;
      return chain;
    },
    paginate(opts) {
      return createPaginatedChain(state, opts);
    },
    async collect() {
      let query = state.baseQuery;
      if (state.orderDirection) {
        query = query.order(state.orderDirection);
      }
      let results;
      if (state.takeLimit !== void 0) {
        results = await query.take(state.takeLimit);
      } else {
        results = await query.collect();
      }
      if (state.shouldPostFilter && state.wherePlan?.postFilter) {
        results = applyPostFilter(results, state.wherePlan.postFilter);
      }
      return results;
    },
    async toPayload() {
      const results = await chain.collect();
      return compileToPayload(results);
    },
    async first() {
      const results = await chain.take(1).collect();
      return results.length > 0 ? results[0] : null;
    }
  };
  return chain;
}
function createPaginatedChain(state, paginationOpts) {
  let shouldPostFilter = state.shouldPostFilter;
  const chain = {
    postFilter() {
      shouldPostFilter = true;
      return chain;
    },
    async collect() {
      let query = state.baseQuery;
      if (state.orderDirection) {
        query = query.order(state.orderDirection);
      }
      const result = await query.paginate(paginationOpts);
      if (shouldPostFilter && state.wherePlan?.postFilter) {
        return {
          ...result,
          page: applyPostFilter(result.page, state.wherePlan.postFilter)
        };
      }
      return result;
    },
    async toPayload() {
      const result = await chain.collect();
      return compilePaginatedToPayload(result);
    }
  };
  return chain;
}
function createConvexQueryProcessor(props) {
  const { ctx, service, collection, wherePlan, index } = props;
  return {
    query() {
      const baseQuery = normalizeConvexQuery({
        ctx,
        service,
        collection,
        index
      });
      const state = {
        ctx,
        service,
        collection,
        wherePlan,
        index,
        baseQuery,
        shouldPostFilter: false
      };
      const chain = createQueryChain(state);
      if (wherePlan?.dbFilter) {
        return chain.filter();
      }
      return chain;
    },
    applyPostFilter(results, plan) {
      const effectivePlan = plan || wherePlan;
      if (effectivePlan?.postFilter) {
        return applyPostFilter(results, effectivePlan.postFilter);
      }
      return results;
    },
    toPayload(data) {
      return compileToPayload(data);
    },
    // Legacy method for backward compatibility
    processWherePlan(context) {
      const {
        ctx: contextCtx,
        service: contextService,
        wherePlan: contextWherePlan,
        collection: contextCollection,
        index: contextIndex
      } = context;
      const baseQuery = normalizeConvexQuery({
        ctx: contextCtx,
        service: contextService,
        collection: contextCollection,
        index: contextIndex
      });
      const filtered = applyWherePlan(baseQuery, contextWherePlan);
      return filtered;
    }
  };
}
function queryProcessor(props) {
  if (props.convex === false) {
    return createAdapterQueryProcessor(props);
  }
  return createConvexQueryProcessor(props);
}

// src/tools/random.ts
import { v4 as uuidv4 } from "uuid";
function createRandomID() {
  return uuidv4();
}

// src/tools/sanitize-incoming-data.ts
var SYSTEM_ALLOW_LIST = /* @__PURE__ */ new Set([
  // Identity / timestamps
  "id",
  "_id",
  "createdAt",
  "updatedAt",
  "_creationTime",
  // Draft/publish workflow
  "_status",
  // Verification workflow
  "_verified",
  "_verificationToken",
  // Auth runtime state
  "_strategy",
  "collection",
  "loginAttempts",
  "lockUntil",
  "sessions",
  "hash",
  "salt",
  "resetPasswordToken",
  "resetPasswordExpiration",
  "apiKey",
  "apiKeyIndex"
]);
var NEVER_ALLOWED = /* @__PURE__ */ new Set([
  "confirm-password",
  "current-password",
  "new-password"
]);
function sanitizeIncomingData(props) {
  const { service, collection, data, operation } = props;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }
  const payload = service.payload;
  const config = payload?.collections?.[collection]?.config;
  const flattened = config && Array.isArray(config.flattenedFields) ? config.flattenedFields : null;
  if (!flattened) {
    const fallback = {};
    const dropped2 = [];
    for (const [key, value] of Object.entries(data)) {
      if (NEVER_ALLOWED.has(key)) {
        dropped2.push(key);
        continue;
      }
      fallback[key] = value;
    }
    if (dropped2.length > 0) {
      service.system.logger({
        fn: "sanitizeIncomingData",
        reason: "virtual_form_field_blocklist",
        operation,
        collection,
        droppedKeys: dropped2
      }).warn();
    }
    return fallback;
  }
  const allowed = new Set(SYSTEM_ALLOW_LIST);
  for (const field of flattened) {
    if (field?.name) allowed.add(field.name);
  }
  const result = {};
  const dropped = [];
  for (const [key, value] of Object.entries(data)) {
    if (NEVER_ALLOWED.has(key)) {
      dropped.push(key);
      continue;
    }
    if (allowed.has(key)) {
      result[key] = value;
      continue;
    }
    dropped.push(key);
  }
  if (dropped.length > 0) {
    service.system.logger({
      fn: "sanitizeIncomingData",
      reason: "unknown_top_level_key",
      operation,
      collection,
      droppedKeys: dropped
    }).warn();
  }
  return result;
}

// src/tools/scripts.ts
import { spawn } from "child_process";

// src/tools/session-tracker.ts
function createSessionTracker() {
  const sessions = /* @__PURE__ */ new Map();
  const createSession = (id) => {
    if (sessions.has(id)) {
      throw new Error(`Session ${id} already exists`);
    }
    const session = {
      id,
      state: "idle",
      createdAt: /* @__PURE__ */ new Date(),
      operations: []
    };
    sessions.set(id, session);
    return session;
  };
  const getSession = (id) => {
    return sessions.get(id);
  };
  const hasSession = (id) => {
    return sessions.has(id);
  };
  const startSession = (id) => {
    const session = sessions.get(id);
    if (!session) {
      throw new Error(`Session ${id} not found`);
    }
    if (session.state !== "idle") {
      throw new Error(
        `Cannot start session ${id}: session is already ${session.state}`
      );
    }
    session.state = "in-progress";
    session.startedAt = /* @__PURE__ */ new Date();
    return session;
  };
  const resolveSession = (id) => {
    const session = sessions.get(id);
    if (!session) {
      throw new Error(`Session ${id} not found`);
    }
    if (session.state !== "in-progress") {
      throw new Error(
        `Cannot resolve session ${id}: session is ${session.state}, expected in-progress`
      );
    }
    session.state = "resolved";
    session.resolvedAt = /* @__PURE__ */ new Date();
    return session;
  };
  const rejectSession = (id) => {
    const session = sessions.get(id);
    if (!session) {
      throw new Error(`Session ${id} not found`);
    }
    if (session.state !== "in-progress") {
      throw new Error(
        `Cannot reject session ${id}: session is ${session.state}, expected in-progress`
      );
    }
    session.state = "rejected";
    session.rejectedAt = /* @__PURE__ */ new Date();
    return session;
  };
  const deleteSession = (id) => {
    return sessions.delete(id);
  };
  const getIdleSessions = () => {
    return Array.from(sessions.values()).filter(
      (session) => session.state === "idle"
    );
  };
  const getInProgressSessions = () => {
    return Array.from(sessions.values()).filter(
      (session) => session.state === "in-progress"
    );
  };
  const getAllSessions = () => {
    return Array.from(sessions.values());
  };
  const clearAll = () => {
    sessions.clear();
  };
  const getIdleCount = () => {
    return getIdleSessions().length;
  };
  const getInProgressCount = () => {
    return getInProgressSessions().length;
  };
  const trackOperation = (sessionId, operation) => {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    if (session.state !== "in-progress") {
      throw new Error(
        `Cannot track operation for session ${sessionId}: session is ${session.state}, expected in-progress`
      );
    }
    const trackedOperation = {
      ...operation,
      id: `${sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: /* @__PURE__ */ new Date()
    };
    session.operations.push(trackedOperation);
    return trackedOperation;
  };
  const getSessionOperations = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    return [...session.operations];
  };
  const getSessionOperationsByType = (sessionId, type) => {
    const operations = getSessionOperations(sessionId);
    return operations.filter((op) => op.type === type);
  };
  const getSessionOperationsByCollection = (sessionId, collection) => {
    const operations = getSessionOperations(sessionId);
    return operations.filter((op) => op.collection === collection);
  };
  const clearSessionOperations = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return false;
    }
    session.operations = [];
    return true;
  };
  return {
    createSession,
    getSession,
    hasSession,
    startSession,
    resolveSession,
    rejectSession,
    deleteSession,
    getIdleSessions,
    getInProgressSessions,
    getAllSessions,
    clearAll,
    getIdleCount,
    getInProgressCount,
    trackOperation,
    getSessionOperations,
    getSessionOperationsByType,
    getSessionOperationsByCollection,
    clearSessionOperations
  };
}

// src/tools/logger.ts
function serialize(value) {
  if (typeof value === "string") return value;
  if (value === null) return "null";
  if (value === void 0) return "undefined";
  const seen = [];
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === "object" && val !== null) {
        if (seen.indexOf(val) !== -1) return "[Circular]";
        seen.push(val);
      }
      return val;
    },
    2
  );
}
function createServiceLogger(props) {
  const { prefix } = props;
  const serviceLogger = (message) => {
    const serialized = serialize(message);
    const formattedMessage = `PayloadConvexAdapter [${prefix}]: ${serialized}`;
    return logger({ message: formattedMessage });
  };
  return serviceLogger;
}
function logger(props) {
  const { message } = props;
  return {
    log: () => console.log(message),
    error: () => console.error(message),
    warn: () => console.warn(message)
  };
}

// src/bindings/index.ts
var bindings_exports = {};
__export(bindings_exports, {
  counts: () => counts,
  creates: () => creates,
  deletes: () => deletes,
  drafts: () => drafts,
  finds: () => finds,
  migrations: () => migrations,
  transactions: () => transactions,
  updates: () => updates,
  upserts: () => upserts
});

// src/bindings/transactions/beginTransaction.ts
async function beginTransaction(props) {
  const { service } = props;
  const id = service.tools.createRandomID();
  const session = service.tools.sessionTracker.createSession(id);
  return session.id;
}

// src/bindings/transactions/commitTransaction.ts
async function commitTransaction(props) {
  const { service, incomingID } = props;
  const transactionID = incomingID instanceof Promise ? await incomingID : incomingID;
  const transactionIdStr = transactionID.toString();
  if (!service.tools.sessionTracker.hasSession(transactionIdStr)) {
    return;
  }
  const session = service.tools.sessionTracker.getSession(transactionIdStr);
  if (session?.state !== "in-progress") {
    service.tools.sessionTracker.deleteSession(transactionIdStr);
    return;
  }
  try {
    service.tools.sessionTracker.resolveSession(transactionIdStr);
  } catch (_) {
  }
  service.tools.sessionTracker.deleteSession(transactionIdStr);
}

// src/bindings/transactions/rollbackTransaction.ts
async function rollbackTransaction(props) {
  const { service, incomingID } = props;
  const transactionID = incomingID instanceof Promise ? await incomingID : incomingID;
  const transactionIdStr = transactionID.toString();
  if (!service.tools.sessionTracker.hasSession(transactionIdStr)) {
    return;
  }
  const session = service.tools.sessionTracker.getSession(transactionIdStr);
  if (session?.state !== "in-progress") {
    service.tools.sessionTracker.deleteSession(transactionIdStr);
    return;
  }
  try {
    service.tools.sessionTracker.rejectSession(transactionIdStr);
  } catch (_) {
  }
  service.tools.sessionTracker.deleteSession(transactionIdStr);
}

// src/bindings/count.ts
async function count(props) {
  const { service, incomingCount } = props;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingCount,
    convex: false
  });
  const totalDocs = await service.db.query({}).collectionCountQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  return {
    totalDocs
  };
}
async function countVersions(props) {
  const { service, incomingCountVersions } = props;
  const { collection } = incomingCountVersions;
  const versionsCollection = `${collection}_versions`;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingCountVersions,
    collection: versionsCollection,
    convex: false
  });
  const totalDocs = await service.db.query({}).collectionCountQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  return {
    totalDocs
  };
}
async function countGlobalVersions(props) {
  const { service, incomingCountGlobalVersions } = props;
  const { global } = incomingCountGlobalVersions;
  const globalVersionsCollection = `${global}_global_versions`;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingCountGlobalVersions,
    collection: globalVersionsCollection,
    convex: false
  });
  const totalDocs = await service.db.query({}).collectionCountQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  return {
    totalDocs
  };
}

// src/bindings/create.ts
async function unsetLatestOnOlderVersions(props) {
  const { service, versionsCollection, parent, newUpdatedAt } = props;
  const where = {
    and: [
      { parent: { equals: parent } },
      { latest: { equals: true } },
      { updatedAt: { less_than: newUpdatedAt } }
    ]
  };
  const processedQuery = service.tools.queryProcessor({
    service,
    collection: versionsCollection,
    where,
    convex: false
  });
  const docs = await service.db.query({}).collectionWhereQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  if (docs && docs.length > 0) {
    await Promise.all(
      docs.map(
        (doc) => service.db.mutation({}).patch.adapter({
          service,
          id: doc.id,
          data: { latest: false }
          // Set to false (undefined is stripped by Convex patch)
        })
      )
    );
  }
}
async function unsetLatestOnOlderGlobalVersions(props) {
  const { service, versionsCollection, newUpdatedAt } = props;
  const where = {
    and: [
      { latest: { equals: true } },
      { updatedAt: { less_than: newUpdatedAt } }
    ]
  };
  const processedQuery = service.tools.queryProcessor({
    service,
    collection: versionsCollection,
    where,
    convex: false
  });
  const docs = await service.db.query({}).collectionWhereQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  if (docs && docs.length > 0) {
    await Promise.all(
      docs.map(
        (doc) => service.db.mutation({}).patch.adapter({
          service,
          id: doc.id,
          data: { latest: false }
          // Set to false (undefined is stripped by Convex patch)
        })
      )
    );
  }
}
async function create(props) {
  const { service, incomingCreate } = props;
  const { collection, data, draft, returning = true } = incomingCreate;
  const filteredData = sanitizeIncomingData({
    service,
    collection,
    data,
    operation: "create"
  });
  const documentData = draft ? { ...filteredData, _status: "draft" } : filteredData;
  const docId = await service.db.mutation({}).insert.adapter({
    service,
    collection,
    data: documentData
  });
  if (!returning) {
    return { id: docId };
  }
  const doc = await service.db.query({}).getById.adapter({
    service,
    collection,
    id: docId
  });
  return doc;
}
async function createGlobal(props) {
  const { service, incomingCreateGlobal } = props;
  const { slug, data, returning = true } = incomingCreateGlobal;
  const globalCollection = `_globals_${slug}`;
  const docId = await service.db.mutation({}).insert.adapter({
    service,
    collection: globalCollection,
    data
  });
  if (!returning) {
    return { id: docId };
  }
  const doc = await service.db.query({}).getById.adapter({
    service,
    collection: globalCollection,
    id: docId
  });
  return doc;
}
async function createVersion(props) {
  const { service, incomingCreateVersion } = props;
  const {
    collectionSlug,
    parent,
    versionData,
    autosave,
    createdAt,
    updatedAt,
    publishedLocale,
    returning = true,
    snapshot
  } = incomingCreateVersion;
  const versionsCollection = `${collectionSlug}_versions`;
  await unsetLatestOnOlderVersions({
    service,
    versionsCollection,
    parent,
    newUpdatedAt: updatedAt
  });
  const versionDoc = {
    parent,
    version: versionData,
    autosave,
    pca_createdAt: createdAt,
    updatedAt,
    publishedLocale,
    latest: true
    // Mark as latest version
  };
  if (snapshot !== void 0) {
    versionDoc.snapshot = snapshot;
  }
  const docId = await service.db.mutation({}).insert.adapter({
    service,
    collection: versionsCollection,
    data: versionDoc
  });
  service.system.setRecentVersionId(docId);
  if (!returning) {
    return { id: docId };
  }
  const doc = await service.db.query({}).getById.adapter({
    service,
    collection: versionsCollection,
    id: docId
  });
  return doc;
}
async function createGlobalVersion(props) {
  const { service, incomingCreateGlobalVersion } = props;
  const {
    globalSlug,
    versionData,
    autosave,
    createdAt,
    updatedAt,
    publishedLocale,
    returning = true,
    snapshot
  } = incomingCreateGlobalVersion;
  const globalVersionsCollection = `${globalSlug}_global_versions`;
  await unsetLatestOnOlderGlobalVersions({
    service,
    versionsCollection: globalVersionsCollection,
    newUpdatedAt: updatedAt
  });
  const versionDoc = {
    version: versionData,
    autosave,
    pca_createdAt: createdAt,
    updatedAt,
    publishedLocale,
    latest: true
    // Mark as latest version
  };
  if (snapshot !== void 0) {
    versionDoc.snapshot = snapshot;
  }
  const docId = await service.db.mutation({}).insert.adapter({
    service,
    collection: globalVersionsCollection,
    data: versionDoc
  });
  service.system.setRecentVersionId(docId);
  if (!returning) {
    return { id: docId };
  }
  const doc = await service.db.query({}).getById.adapter({
    service,
    collection: globalVersionsCollection,
    id: docId
  });
  return doc;
}
async function createMigration(props) {
  const { service, incomingCreateMigration } = props;
}

// src/bindings/find.ts
async function find(props) {
  const { service, incomingFind } = props;
  const {
    collection,
    limit = 10,
    page = 1,
    pagination = true,
    skip
  } = incomingFind;
  const effectivePage = skip !== void 0 ? Math.floor(skip / limit) + 1 : page;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingFind,
    page: effectivePage,
    convex: false
  });
  if (!pagination || limit === 0) {
    const docs2 = await service.db.query({}).collectionWhereQuery.adapter({
      service,
      ...processedQuery.convexQueryProps
    });
    return {
      docs: docs2,
      totalDocs: docs2.length,
      limit: docs2.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      pagingCounter: 1
    };
  }
  const totalDocs = await service.db.query({}).collectionCountQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = effectivePage < totalPages;
  const hasPrevPage = effectivePage > 1;
  const pagingCounter = (effectivePage - 1) * limit + 1;
  const allDocs = await service.db.query({}).collectionWhereOrderQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    order: processedQuery.convexQueryProps.order ?? "desc"
  });
  const sortedDocs = applySortField(
    allDocs,
    processedQuery.convexQueryProps.sortField,
    processedQuery.convexQueryProps.order ?? "desc"
  );
  const skipAmount = skip !== void 0 ? skip : (effectivePage - 1) * limit;
  const docs = sortedDocs.slice(skipAmount, skipAmount + limit);
  return {
    docs,
    totalDocs,
    limit,
    page: effectivePage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    pagingCounter,
    nextPage: hasNextPage ? effectivePage + 1 : null,
    prevPage: hasPrevPage ? effectivePage - 1 : null
  };
}
async function findOne(props) {
  const { service, incomingFindOne } = props;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingFindOne,
    limit: 1,
    convex: false
  });
  const docs = await service.db.query({}).collectionWhereLimitQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    limit: processedQuery.convexQueryProps.limit
  });
  if (!docs || docs.length === 0) {
    return null;
  }
  return docs[0];
}
async function findDistinct(props) {
  const { service, incomingFindDistinct } = props;
  const { field, limit = 10, page = 1 } = incomingFindDistinct;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingFindDistinct,
    convex: false
  });
  const allDocs = await service.db.query({}).collectionWhereOrderQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    order: processedQuery.convexQueryProps.order ?? "desc"
  });
  const valueSet = /* @__PURE__ */ new Set();
  for (const doc of allDocs) {
    const value = doc[field];
    if (value !== void 0 && value !== null) {
      valueSet.add(value);
    }
  }
  const allValues = Array.from(valueSet);
  const totalDocs = allValues.length;
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const pagingCounter = (page - 1) * limit + 1;
  const skip = (page - 1) * limit;
  const values = allValues.slice(skip, skip + limit);
  return {
    values: values.map((v3) => ({ [field]: v3 })),
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    pagingCounter,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
}
async function findGlobal(props) {
  const { service, incomingFindGlobal } = props;
  const { slug } = incomingFindGlobal;
  const globalCollection = `_globals_${slug}`;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingFindGlobal,
    collection: globalCollection,
    limit: 1,
    convex: false
  });
  const docs = await service.db.query({}).collectionWhereLimitQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    limit: processedQuery.convexQueryProps.limit
  });
  if (!docs || docs.length === 0) {
    return {};
  }
  return docs[0];
}
async function findVersions(props) {
  const { service, incomingFindVersions } = props;
  const {
    collection,
    limit = 10,
    page = 1,
    pagination = true,
    skip
  } = incomingFindVersions;
  const effectivePage = skip !== void 0 ? Math.floor(skip / limit) + 1 : page;
  const versionsCollection = `${collection}_versions`;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingFindVersions,
    collection: versionsCollection,
    page: effectivePage,
    convex: false
  });
  if (!pagination || limit === 0) {
    const docs2 = await service.db.query({}).collectionWhereOrderQuery.adapter({
      service,
      ...processedQuery.convexQueryProps,
      order: processedQuery.convexQueryProps.order ?? "desc"
    });
    return {
      docs: docs2,
      totalDocs: docs2.length,
      limit: docs2.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      pagingCounter: 1
    };
  }
  const totalDocs = await service.db.query({}).collectionCountQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = effectivePage < totalPages;
  const hasPrevPage = effectivePage > 1;
  const pagingCounter = (effectivePage - 1) * limit + 1;
  const skipAmount = skip !== void 0 ? skip : (effectivePage - 1) * limit;
  const allDocs = await service.db.query({}).collectionWhereOrderQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    order: processedQuery.convexQueryProps.order ?? "desc"
  });
  const sortedDocs = applySortField(
    allDocs,
    processedQuery.convexQueryProps.sortField,
    processedQuery.convexQueryProps.order ?? "desc"
  );
  const docs = sortedDocs.slice(skipAmount, skipAmount + limit);
  return {
    docs,
    totalDocs,
    limit,
    page: effectivePage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    pagingCounter,
    nextPage: hasNextPage ? effectivePage + 1 : null,
    prevPage: hasPrevPage ? effectivePage - 1 : null
  };
}
async function findGlobalVersions(props) {
  const { service, incomingFindGlobalVersions } = props;
  const {
    global,
    limit = 10,
    page = 1,
    pagination = true,
    skip
  } = incomingFindGlobalVersions;
  const effectivePage = skip !== void 0 ? Math.floor(skip / limit) + 1 : page;
  const globalVersionsCollection = `${global}_global_versions`;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingFindGlobalVersions,
    collection: globalVersionsCollection,
    page: effectivePage,
    convex: false
  });
  if (!pagination || limit === 0) {
    const docs2 = await service.db.query({}).collectionWhereOrderQuery.adapter({
      service,
      ...processedQuery.convexQueryProps,
      order: processedQuery.convexQueryProps.order ?? "desc"
    });
    return {
      docs: docs2,
      totalDocs: docs2.length,
      limit: docs2.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      pagingCounter: 1
    };
  }
  const totalDocs = await service.db.query({}).collectionCountQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = effectivePage < totalPages;
  const hasPrevPage = effectivePage > 1;
  const pagingCounter = (effectivePage - 1) * limit + 1;
  const skipAmount = skip !== void 0 ? skip : (effectivePage - 1) * limit;
  const allDocs = await service.db.query({}).collectionWhereOrderQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    order: processedQuery.convexQueryProps.order ?? "desc"
  });
  const sortedDocs = applySortField(
    allDocs,
    processedQuery.convexQueryProps.sortField,
    processedQuery.convexQueryProps.order ?? "desc"
  );
  const docs = sortedDocs.slice(skipAmount, skipAmount + limit);
  return {
    docs,
    totalDocs,
    limit,
    page: effectivePage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    pagingCounter,
    nextPage: hasNextPage ? effectivePage + 1 : null,
    prevPage: hasPrevPage ? effectivePage - 1 : null
  };
}

// src/bindings/delete.ts
async function deleteOne(props) {
  const { service, incomingDeleteOne } = props;
  const { returning = true } = incomingDeleteOne;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingDeleteOne,
    convex: false
  });
  const docs = await service.db.query({}).collectionWhereQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  if (!docs || docs.length === 0) {
    return null;
  }
  const doc = docs[0];
  await service.db.mutation({}).deleteOp.adapter({
    service,
    id: doc.id
  });
  if (!returning) {
    return { id: doc.id };
  }
  return doc;
}
async function deleteMany(props) {
  const { service, incomingDeleteMany } = props;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingDeleteMany,
    convex: false
  });
  await service.db.mutation({}).deleteManyWhere.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
}
async function deleteVersions(props) {
  const { service, incomingDeleteVersions } = props;
  const { collection, globalSlug, where, locale } = incomingDeleteVersions;
  const versionsCollection = collection ? `${collection}_versions` : `${globalSlug}_global_versions`;
  const processedQuery = service.tools.queryProcessor({
    service,
    collection: versionsCollection,
    where,
    locale,
    convex: false
  });
  let safeguardedWherePlan = convertLteToLtForUpdatedAt(
    processedQuery.convexQueryProps.wherePlan
  );
  const recentVersionId = service.system.getRecentVersionId();
  if (recentVersionId) {
    safeguardedWherePlan = addVersionIdExclusion(
      safeguardedWherePlan,
      recentVersionId
    );
  }
  safeguardedWherePlan = addPublishedVersionExclusion(safeguardedWherePlan);
  await service.db.mutation({}).deleteManyWhere.adapter({
    service,
    ...processedQuery.convexQueryProps,
    wherePlan: safeguardedWherePlan
  });
}

// src/bindings/update.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function splitIncrementOps(data) {
  const incOps = [];
  const patchData = {};
  if (!data) {
    return { incOps, patchData };
  }
  for (const [field, value] of Object.entries(data)) {
    if (field === "createdAt" || field === "id" || field === "_id" || field === "_creationTime") {
      continue;
    }
    if (isRecord(value) && "$inc" in value) {
      const amount = value["$inc"];
      if (typeof amount !== "number") {
        throw new Error(
          `Unsupported $inc payload for field '${field}': expected number`
        );
      }
      incOps.push({ field, amount });
      continue;
    }
    patchData[field] = value;
  }
  return { incOps, patchData };
}
async function applyPatchWithIncrements(service, id, data) {
  const { incOps, patchData } = splitIncrementOps(data);
  if (Object.keys(patchData).length > 0) {
    await service.db.mutation({}).patch.adapter({
      service,
      id,
      data: patchData
    });
  }
  for (const inc of incOps) {
    await service.db.mutation({}).increment.adapter({
      service,
      id,
      field: inc.field,
      amount: inc.amount
    });
  }
}
async function updateOne(props) {
  const { service, incomingUpdateOne } = props;
  const {
    collection,
    data,
    id,
    where,
    draft,
    returning = true
  } = incomingUpdateOne;
  let docId;
  if (id) {
    docId = id;
  } else if (where) {
    const processedQuery = service.tools.queryProcessor({
      service,
      ...incomingUpdateOne,
      limit: 1,
      convex: false
    });
    const docs = await service.db.query({}).collectionWhereLimitQuery.adapter({
      service,
      ...processedQuery.convexQueryProps,
      limit: processedQuery.convexQueryProps.limit
    });
    if (!docs || docs.length === 0) {
      throw new Error(
        `updateOne: Document not found in collection '${collection}' matching where clause`
      );
    }
    docId = docs[0].id;
  } else {
    throw new Error("updateOne requires either id or where parameter");
  }
  const filteredData = sanitizeIncomingData({
    service,
    collection,
    data,
    operation: "update"
  });
  const updateData = draft !== void 0 ? {
    ...filteredData,
    _status: draft ? "draft" : "published"
  } : filteredData;
  await applyPatchWithIncrements(
    service,
    docId,
    updateData
  );
  if (!returning) {
    return { id: docId };
  }
  const updatedDoc = await service.db.query({}).getById.adapter({
    service,
    collection,
    id: docId
  });
  if (!updatedDoc) {
    throw new Error(
      `updateOne: Document with id '${docId}' not found after update in collection '${collection}'`
    );
  }
  return updatedDoc;
}
async function updateMany(props) {
  const { service, incomingUpdateMany } = props;
  const {
    collection,
    data,
    draft,
    limit,
    returning = true
  } = incomingUpdateMany;
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingUpdateMany,
    convex: false
  });
  const docs = await service.db.query({}).collectionWhereQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  if (!docs || docs.length === 0) {
    return null;
  }
  const docsToUpdate = limit ? docs.slice(0, limit) : docs;
  const filteredData = sanitizeIncomingData({
    service,
    collection,
    data,
    operation: "update"
  });
  const updateData = draft !== void 0 ? {
    ...filteredData,
    _status: draft ? "draft" : "published"
  } : filteredData;
  for (const doc of docsToUpdate) {
    await applyPatchWithIncrements(
      service,
      doc.id,
      updateData
    );
  }
  if (!returning) {
    return null;
  }
  const updatedDocs = await service.db.query({}).collectionWhereQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  const rawDocs = limit ? updatedDocs.slice(0, limit) : updatedDocs;
  return rawDocs;
}
async function updateGlobal(props) {
  const { service, incomingUpdateGlobal } = props;
  const { slug, data, returning = true } = incomingUpdateGlobal;
  const globalCollection = `_globals_${slug}`;
  const docs = await service.db.query({}).collectionWhereLimitQuery.adapter({
    service,
    collection: globalCollection,
    wherePlan: service.tools.emptyWherePlan(),
    limit: 1,
    index: void 0
  });
  if (!docs || docs.length === 0) {
    throw new Error(`Global document not found for slug: ${slug}`);
  }
  const docId = docs[0].id;
  await applyPatchWithIncrements(
    service,
    docId,
    data
  );
  if (!returning) {
    return { id: docId };
  }
  const updatedDoc = await service.db.query({}).getById.adapter({
    service,
    collection: globalCollection,
    id: docId
  });
  return updatedDoc;
}
async function updateVersion(props) {
  const { service, incomingUpdateVersion } = props;
  const {
    collection,
    versionData,
    id,
    where,
    returning = true
  } = incomingUpdateVersion;
  const versionsCollection = `${collection}_versions`;
  let docId;
  if (id) {
    docId = id;
  } else if (where) {
    const processedQuery = service.tools.queryProcessor({
      service,
      ...incomingUpdateVersion,
      collection: versionsCollection,
      limit: 1,
      convex: false
    });
    const docs = await service.db.query({}).collectionWhereLimitQuery.adapter({
      service,
      ...processedQuery.convexQueryProps,
      limit: 1
    });
    if (!docs || docs.length === 0) {
      return null;
    }
    docId = docs[0].id;
  } else {
    throw new Error("updateVersion requires either id or where parameter");
  }
  const patchData = { ...versionData };
  if ("createdAt" in patchData) {
    patchData.pca_createdAt = patchData.createdAt;
    delete patchData.createdAt;
  }
  await applyPatchWithIncrements(service, docId, patchData);
  if (!returning) {
    return { id: docId };
  }
  const updatedDoc = await service.db.query({}).getById.adapter({
    service,
    collection: versionsCollection,
    id: docId
  });
  return updatedDoc;
}
async function updateGlobalVersion(props) {
  const { service, incomingUpdateGlobalVersion } = props;
  const {
    global,
    versionData,
    id,
    where,
    returning = true
  } = incomingUpdateGlobalVersion;
  const globalVersionsCollection = `${global}_global_versions`;
  let docId;
  if (id) {
    docId = id;
  } else if (where) {
    const processedQuery = service.tools.queryProcessor({
      service,
      ...incomingUpdateGlobalVersion,
      collection: globalVersionsCollection,
      limit: 1,
      convex: false
    });
    const docs = await service.db.query({}).collectionWhereLimitQuery.adapter({
      service,
      ...processedQuery.convexQueryProps,
      limit: 1
    });
    if (!docs || docs.length === 0) {
      return null;
    }
    docId = docs[0].id;
  } else {
    throw new Error(
      "updateGlobalVersion requires either id or where parameter"
    );
  }
  const patchData = { ...versionData };
  if ("createdAt" in patchData) {
    patchData.pca_createdAt = patchData.createdAt;
    delete patchData.createdAt;
  }
  await applyPatchWithIncrements(service, docId, patchData);
  if (!returning) {
    return { id: docId };
  }
  const updatedDoc = await service.db.query({}).getById.adapter({
    service,
    collection: globalVersionsCollection,
    id: docId
  });
  return updatedDoc;
}
async function updateJobs(props) {
  const { service, incomingUpdateJobs } = props;
  const { data, id, where, limit, returning = true } = incomingUpdateJobs;
  const jobsCollection = "_jobs";
  if (id) {
    await applyPatchWithIncrements(
      service,
      id,
      data
    );
    if (!returning) {
      return [{ id }];
    }
    const updatedJob = await service.db.query({}).getById.adapter({
      service,
      collection: jobsCollection,
      id
    });
    return [updatedJob];
  }
  if (where) {
    const processedQuery = service.tools.queryProcessor({
      service,
      ...incomingUpdateJobs,
      collection: jobsCollection,
      convex: false
    });
    const jobs = limit ? await service.db.query({}).collectionWhereLimitQuery.adapter({
      service,
      ...processedQuery.convexQueryProps,
      limit: processedQuery.convexQueryProps.limit
    }) : await service.db.query({}).collectionWhereQuery.adapter({
      service,
      ...processedQuery.convexQueryProps
    });
    if (!jobs || jobs.length === 0) {
      return null;
    }
    for (const job of jobs) {
      await applyPatchWithIncrements(
        service,
        job.id,
        data
      );
    }
    if (!returning) {
      return null;
    }
    const updatedJobs = limit ? await service.db.query({}).collectionWhereLimitQuery.adapter({
      service,
      ...processedQuery.convexQueryProps,
      limit: processedQuery.convexQueryProps.limit
    }) : await service.db.query({}).collectionWhereQuery.adapter({
      service,
      ...processedQuery.convexQueryProps
    });
    return updatedJobs;
  }
  throw new Error("updateJobs requires either id or where parameter");
}

// src/bindings/upsert.ts
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function splitIncrementOps2(data) {
  const incOps = [];
  const patchData = {};
  if (!data) {
    return { incOps, patchData };
  }
  for (const [field, value] of Object.entries(data)) {
    if (field === "createdAt" || field === "id" || field === "_id" || field === "_creationTime") {
      continue;
    }
    if (isRecord2(value) && "$inc" in value) {
      const amount = value["$inc"];
      if (typeof amount !== "number") {
        throw new Error(
          `Unsupported $inc payload for field '${field}': expected number`
        );
      }
      incOps.push({ field, amount });
      continue;
    }
    patchData[field] = value;
  }
  return { incOps, patchData };
}
async function applyPatchWithIncrements2(service, id, data) {
  const { incOps, patchData } = splitIncrementOps2(data);
  if (Object.keys(patchData).length > 0) {
    await service.db.mutation({}).patch.adapter({
      service,
      id,
      data: patchData
    });
  }
  for (const inc of incOps) {
    await service.db.mutation({}).increment.adapter({
      service,
      id,
      field: inc.field,
      amount: inc.amount
    });
  }
}
function normalizeInsertData(data) {
  const { incOps, patchData } = splitIncrementOps2(data);
  if (incOps.length === 0) {
    return patchData;
  }
  const normalized = { ...patchData };
  for (const inc of incOps) {
    normalized[inc.field] = inc.amount;
  }
  return normalized;
}
async function upsert2(props) {
  const { service, incomingUpsert } = props;
  const { collection, data, returning = true } = incomingUpsert;
  const filteredData = sanitizeIncomingData({
    service,
    collection,
    data,
    operation: "upsert"
  });
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingUpsert,
    limit: 1,
    convex: false
  });
  const existingDocs = await service.db.query({}).collectionWhereLimitQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    limit: processedQuery.convexQueryProps.limit
  });
  if (existingDocs && existingDocs.length > 0) {
    const docId = existingDocs[0].id;
    await applyPatchWithIncrements2(
      service,
      docId,
      filteredData
    );
    if (!returning) {
      return { id: docId };
    }
    const updatedDoc = await service.db.query({}).getById.adapter({
      service,
      collection,
      id: docId
    });
    return updatedDoc;
  } else {
    const normalizedData = normalizeInsertData(
      filteredData
    );
    const docId = await service.db.mutation({}).insert.adapter({
      service,
      collection,
      data: normalizedData
    });
    if (!returning) {
      return { id: docId };
    }
    const newDoc = await service.db.query({}).getById.adapter({
      service,
      collection,
      id: docId
    });
    return newDoc;
  }
}

// src/bindings/drafts.ts
async function queryDrafts(props) {
  const { service, incomingQueryDrafts } = props;
  const {
    collection,
    where,
    limit = 10,
    page = 1,
    pagination = true
  } = incomingQueryDrafts;
  const versionsCollection = `${collection}_versions`;
  const whereStr = where ? JSON.stringify(where) : "";
  const hasParentFilter = whereStr.includes('"parent"');
  const hasLatestFilter = whereStr.includes('"latest"');
  let parentValue;
  if (hasParentFilter && where && "and" in where && Array.isArray(where.and)) {
    for (const condition of where.and) {
      if (condition && typeof condition === "object" && "parent" in condition) {
        const parentCondition = condition.parent;
        if (parentCondition && "equals" in parentCondition) {
          parentValue = parentCondition.equals;
          break;
        }
      }
    }
  } else if (hasParentFilter && where && "parent" in where) {
    const parentCondition = where.parent;
    if (parentCondition && "equals" in parentCondition) {
      parentValue = parentCondition.equals;
    }
  }
  const combinedWhere = hasParentFilter && !hasLatestFilter && parentValue ? { parent: { equals: parentValue } } : {
    and: [
      { latest: { equals: true } },
      // Only latest versions (preview mode, list view)
      ...where ? [where] : []
    ]
  };
  const processedQuery = service.tools.queryProcessor({
    service,
    ...incomingQueryDrafts,
    collection: versionsCollection,
    where: combinedWhere,
    convex: false
  });
  function transformVersionDocs(versionDocs) {
    return versionDocs.map((versionDoc) => {
      const id = versionDoc.parent;
      const doc = versionDoc.version ?? {};
      doc.id = id;
      return doc;
    });
  }
  if (!pagination || limit === 0) {
    const versionDocs = await service.db.query({}).collectionWhereQuery.adapter({
      service,
      ...processedQuery.convexQueryProps
    });
    const docs2 = transformVersionDocs(versionDocs);
    return {
      docs: docs2,
      totalDocs: docs2.length,
      limit: docs2.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      pagingCounter: 1
    };
  }
  const totalDocs = await service.db.query({}).collectionCountQuery.adapter({
    service,
    ...processedQuery.convexQueryProps
  });
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const pagingCounter = (page - 1) * limit + 1;
  const skip = (page - 1) * limit;
  const allVersionDocs = await service.db.query({}).collectionWhereOrderQuery.adapter({
    service,
    ...processedQuery.convexQueryProps,
    order: processedQuery.convexQueryProps.order ?? "desc"
  });
  const sortedVersionDocs = applySortField(
    allVersionDocs,
    processedQuery.convexQueryProps.sortField,
    processedQuery.convexQueryProps.order ?? "desc"
  );
  const paginatedVersionDocs = sortedVersionDocs.slice(skip, skip + limit);
  const docs = transformVersionDocs(paginatedVersionDocs);
  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    pagingCounter,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
}

// src/bindings/migrate.ts
async function migrate(props) {
  const { service } = props;
}
async function migrateDown(props) {
  const { service } = props;
}
async function migrateFresh(props) {
  const { service } = props;
}
async function migrateRefresh(props) {
  const { service } = props;
}
async function migrateReset(props) {
  const { service } = props;
}
async function migrateStatus(props) {
  const { service } = props;
}

// src/bindings/index.ts
var transactions = {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
};
var counts = {
  count,
  countVersions,
  countGlobalVersions
};
var creates = {
  create,
  createGlobal,
  createVersion,
  createGlobalVersion,
  createMigration
};
var finds = {
  find,
  findOne,
  findDistinct,
  findGlobal,
  findVersions,
  findGlobalVersions
};
var deletes = {
  deleteOne,
  deleteMany,
  deleteVersions
};
var updates = {
  updateOne,
  updateMany,
  updateGlobal,
  updateVersion,
  updateGlobalVersion,
  updateJobs
};
var upserts = {
  upsert: upsert2
};
var drafts = {
  queryDrafts
};
var migrations = {
  migrate,
  migrateDown,
  migrateFresh,
  migrateRefresh,
  migrateReset,
  migrateStatus
};

// src/adapter/service.ts
function createAdapterService(props) {
  const { payload, prefix, convexUrl } = props;
  const convexClient = createConvexClient({ convexUrl });
  const serviceLogger = createServiceLogger({ prefix });
  const sessionTracker = createSessionTracker();
  let recentVersionId;
  const system = {
    url: convexUrl,
    prefix,
    logger: serviceLogger,
    isDev,
    isClient,
    /**
     * Sets the ID of a recently created version to protect it from cleanup.
     * This is used to coordinate between createVersion and deleteVersions operations.
     */
    setRecentVersionId: (id) => {
      recentVersionId = id;
    },
    /**
     * Gets the ID of the recently created version, if any.
     * Returns undefined if no version was recently created.
     */
    getRecentVersionId: () => recentVersionId,
    /**
     * Clears the recent version ID after cleanup is complete.
     */
    clearRecentVersionId: () => {
      recentVersionId = void 0;
    }
  };
  const db = {
    client: convexClient,
    bindings: bindings_exports,
    query: QueryAdapter,
    mutation: MutationAdapter,
    api: anyApi
  };
  const tools = {
    sessionTracker,
    createRandomID,
    queryProcessor,
    parseCollection,
    createWherePlan,
    emptyWherePlan
  };
  return {
    db,
    tools,
    system,
    payload
  };
}

// src/adapter/index.ts
function convexAdapter(props) {
  return {
    name: "payload-convex-adapter",
    allowIDOnCreate: false,
    defaultIDType: "text",
    init: (args) => {
      const { payload } = args;
      const service = createAdapterService({
        ...props,
        payload
      });
      return createDatabaseAdapter({
        payload,
        name: "payload-convex",
        packageName: "payload-convex-adapter",
        defaultIDType: "text",
        migrationDir: "./migrations",
        // Transaction Bindings
        beginTransaction: (async (props2) => {
          return await service.db.bindings.transactions.beginTransaction({
            service
          });
        }),
        commitTransaction: (async (id) => {
          return await service.db.bindings.transactions.commitTransaction({
            service,
            incomingID: id
          });
        }),
        rollbackTransaction: (async (id) => {
          return await service.db.bindings.transactions.rollbackTransaction({
            service,
            incomingID: id
          });
        }),
        // Counts
        count: (async (countProps) => {
          return await service.db.bindings.counts.count({
            service,
            incomingCount: countProps
          });
        }),
        countVersions: (async (countVersionsProps) => {
          return await service.db.bindings.counts.countVersions({
            service,
            incomingCountVersions: countVersionsProps
          });
        }),
        countGlobalVersions: (async (countGlobalVersionsProps) => {
          return await service.db.bindings.counts.countGlobalVersions({
            service,
            incomingCountGlobalVersions: countGlobalVersionsProps
          });
        }),
        // Create
        create: (async (createProps) => {
          return await service.db.bindings.creates.create({
            service,
            incomingCreate: createProps
          });
        }),
        createGlobal: (async (createGlobalProps) => {
          return await service.db.bindings.creates.createGlobal({
            service,
            incomingCreateGlobal: createGlobalProps
          });
        }),
        createVersion: (async (createVersionProps) => {
          return await service.db.bindings.creates.createVersion({
            service,
            incomingCreateVersion: createVersionProps
          });
        }),
        createGlobalVersion: (async (createGlobalVersionProps) => {
          return await service.db.bindings.creates.createGlobalVersion({
            service,
            incomingCreateGlobalVersion: createGlobalVersionProps
          });
        }),
        createMigration: (async (createMigrationProps) => {
          return await service.db.bindings.creates.createMigration({
            service,
            incomingCreateMigration: createMigrationProps
          });
        }),
        // Find
        find: (async (findProps) => {
          return await service.db.bindings.finds.find({
            service,
            incomingFind: findProps
          });
        }),
        findOne: (async (findOneProps) => {
          return await service.db.bindings.finds.findOne({
            service,
            incomingFindOne: findOneProps
          });
        }),
        findDistinct: (async (findDistinctProps) => {
          return await service.db.bindings.finds.findDistinct({
            service,
            incomingFindDistinct: findDistinctProps
          });
        }),
        findGlobal: (async (findGlobalProps) => {
          return await service.db.bindings.finds.findGlobal({
            service,
            incomingFindGlobal: findGlobalProps
          });
        }),
        findVersions: (async (findVersionsProps) => {
          return await service.db.bindings.finds.findVersions({
            service,
            incomingFindVersions: findVersionsProps
          });
        }),
        findGlobalVersions: (async (findGlobalVersionsProps) => {
          return await service.db.bindings.finds.findGlobalVersions({
            service,
            incomingFindGlobalVersions: findGlobalVersionsProps
          });
        }),
        // Delete
        deleteOne: (async (deleteOneProps) => {
          return await service.db.bindings.deletes.deleteOne({
            service,
            incomingDeleteOne: deleteOneProps
          });
        }),
        deleteMany: (async (deleteManyProps) => {
          return await service.db.bindings.deletes.deleteMany({
            service,
            incomingDeleteMany: deleteManyProps
          });
        }),
        deleteVersions: (async (deleteVersionsProps) => {
          const result = await service.db.bindings.deletes.deleteVersions({
            service,
            incomingDeleteVersions: deleteVersionsProps
          });
          service.system.clearRecentVersionId();
          return result;
        }),
        // Update
        updateOne: (async (updateOneProps) => {
          return await service.db.bindings.updates.updateOne({
            service,
            incomingUpdateOne: updateOneProps
          });
        }),
        updateMany: (async (updateManyProps) => {
          return await service.db.bindings.updates.updateMany({
            service,
            incomingUpdateMany: updateManyProps
          });
        }),
        updateGlobal: (async (updateGlobalProps) => {
          return await service.db.bindings.updates.updateGlobal({
            service,
            incomingUpdateGlobal: updateGlobalProps
          });
        }),
        updateVersion: (async (updateVersionProps) => {
          return await service.db.bindings.updates.updateVersion({
            service,
            incomingUpdateVersion: updateVersionProps
          });
        }),
        updateGlobalVersion: (async (updateGlobalVersionProps) => {
          return await service.db.bindings.updates.updateGlobalVersion({
            service,
            incomingUpdateGlobalVersion: updateGlobalVersionProps
          });
        }),
        updateJobs: (async (updateJobsProps) => {
          return await service.db.bindings.updates.updateJobs({
            service,
            incomingUpdateJobs: updateJobsProps
          });
        }),
        // Upsert
        upsert: (async (upsertProps) => {
          return await service.db.bindings.upserts.upsert({
            service,
            incomingUpsert: upsertProps
          });
        }),
        // Query Drafts
        queryDrafts: (async (queryDraftsProps) => {
          return await service.db.bindings.drafts.queryDrafts({
            service,
            incomingQueryDrafts: queryDraftsProps
          });
        }),
        // Migration Functions
        migrate: async (migrateProps) => {
          return await service.db.bindings.migrations.migrate({
            service,
            incomingMigrate: migrateProps
          });
        },
        migrateDown: async () => {
          return await service.db.bindings.migrations.migrateDown({
            service
          });
        },
        migrateFresh: async () => {
          return await service.db.bindings.migrations.migrateFresh({
            service
          });
        },
        migrateRefresh: async () => {
          return await service.db.bindings.migrations.migrateRefresh({
            service
          });
        },
        migrateReset: async () => {
          return await service.db.bindings.migrations.migrateReset({
            service
          });
        },
        migrateStatus: async () => {
          return await service.db.bindings.migrations.migrateStatus({
            service
          });
        }
      });
    }
  };
}
export {
  convexAdapter
};
//# sourceMappingURL=index.js.map