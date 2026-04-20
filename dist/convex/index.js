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
export {
  MutationAdapter,
  QueryAdapter,
  adapterCollectionCountQuery,
  adapterCollectionLimitQuery,
  adapterCollectionOrderLimitQuery,
  adapterCollectionOrderPaginateQuery,
  adapterCollectionOrderQuery,
  adapterCollectionQuery,
  adapterCollectionWhereLimitQuery,
  adapterCollectionWhereOrderLimitQuery,
  adapterCollectionWhereOrderPaginateQuery,
  adapterCollectionWhereOrderQuery,
  adapterCollectionWherePaginateQuery,
  adapterCollectionWhereQuery,
  adapterDeleteManyWhere,
  adapterDeleteOp,
  adapterGetById,
  adapterGetByIdMutation,
  adapterIncrement,
  adapterInsert,
  adapterPatch,
  adapterReplace,
  adapterTransactional,
  adapterUpdateManyWhere,
  adapterUpsert,
  collectionCountQuery,
  collectionLimitQuery,
  collectionOrderLimitQuery,
  collectionOrderPaginateQuery,
  collectionOrderQuery,
  collectionQuery,
  collectionWhereLimitQuery,
  collectionWhereOrderLimitQuery,
  collectionWhereOrderPaginateQuery,
  collectionWhereOrderQuery,
  collectionWherePaginateQuery,
  collectionWhereQuery,
  convexCollectionCountQuery,
  convexCollectionLimitQuery,
  convexCollectionOrderLimitQuery,
  convexCollectionOrderPaginateQuery,
  convexCollectionOrderQuery,
  convexCollectionQuery,
  convexCollectionWhereLimitQuery,
  convexCollectionWhereOrderLimitQuery,
  convexCollectionWhereOrderPaginateQuery,
  convexCollectionWhereOrderQuery,
  convexCollectionWherePaginateQuery,
  convexCollectionWhereQuery,
  convexDeleteManyWhere,
  convexDeleteOp,
  convexGetById,
  convexGetByIdMutation,
  convexIncrement,
  convexInsert,
  convexPatch,
  convexReplace,
  convexTransactional,
  convexUpdateManyWhere,
  convexUpsert,
  createConvexClient,
  deleteManyWhere,
  deleteOp,
  getById,
  getByIdMutation,
  increment,
  insert,
  patch,
  replace,
  transactional,
  updateManyWhere,
  upsert
};
//# sourceMappingURL=index.js.map