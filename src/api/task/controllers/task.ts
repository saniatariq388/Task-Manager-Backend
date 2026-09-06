import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::task.task", ({ strapi }) => ({
  // Sirf current logged-in user ke tasks
  async find(ctx: any) {
    const user = ctx.state.user;

    const tasks = await strapi.documents("api::task.task").findMany({
      filters: {
        owner: {
          id: {
            $eq: user.id,
          },
        },
      },
      sort: "dueDate:asc",
      populate: ["owner"],
    });

    return {
      data: tasks,
    };
  },

  // Create — existing working owner logic SAME
  async create(ctx: any) {
    const user = ctx.state.user;
    const { data } = ctx.request.body;

    const entry = await strapi.documents("api::task.task").create({
      data: {
        ...data,
        owner: user.id,
      },
    });

    return { data: entry };
  },

  // Sirf owner apna task delete kar sake
 async delete(ctx: any) {
  const user = ctx.state.user;
  const documentId = ctx.params.id; // ✅ fix 1

  const tasks = await strapi.db.query("api::task.task").findMany({
    where: {
      documentId,       // ✅ fix 2 — flat value
      owner: user.id,   // ✅ fix 2 — flat value
    },
  });

  if (!tasks.length) {
    return ctx.notFound("Task not found");
  }

  const deleted = await strapi.documents("api::task.task").delete({
    documentId,
  });

  return { data: deleted };
},
}));