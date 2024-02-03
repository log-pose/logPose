import { eq, psqlClient, server, server_kind } from "@logpose/drizzle";

export const getRequiredMonitorParams = async (kind: string) => {
  const result = await psqlClient
    .select({
      kindName: server_kind.kind_name,
      requiredFields: server_kind.required_fields,
      kindId: server_kind.id,
    })
    .from(server_kind)
    .where(eq(server_kind.kind_name, kind));

  const validKinds = result.map((item) => item.kindName.toLowerCase());
  if (!validKinds.includes(kind.toLowerCase())) {
    throw `kind must be one of ${validKinds}`;
  }

  let kindId = result.find(
    (item) => item.kindName.toLowerCase() === kind.toLowerCase()
  )?.kindId;

  return {
    requiredStr: result
      .find((item) => item.kindName.toLowerCase() === kind.toLowerCase())
      ?.requiredFields?.split(","),
    kindId,
  };
};

export const createNewMonitor = async (newServer: any) => {
  if (
    !newServer.server_kind_id ||
    !newServer.user_id ||
    !newServer.server_name
  ) {
    throw new Error("server_kind_id, server_name and user_id are required");
  }

  await psqlClient
    .insert(server)
    .values({
      ...newServer,
    })
    .onConflictDoNothing()
    .catch((err) => {
      throw err;
    });
};

export const fetchMonitorById = async (id: string) => {
  const result = await psqlClient
    .select()
    .from(server)
    .where(eq(server.id, id));
  return result[0];
};

export const fetchAllMonitorByUserId = async (userId: string) => {
  const result = await psqlClient
    .select()
    .from(server)
    .where(eq(server.user_id, userId));
  return result;
};

export const deleteMonitor = async (id: string) => {
  await psqlClient.delete(server).where(eq(server.id, id));
};

export const updateMonitor = async (updateServer: any) => {
  await psqlClient
    .update(server)
    .set({
      ...updateServer,
    })
    .where(eq(server.id, updateServer.id))
    .catch((err) => {
      throw err;
    });
};
