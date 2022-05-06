import db from "~/lib/db.server";

import { User } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type LoaderData = User;

export const loader: LoaderFunction = async (args) => {
  const id = args.params.id;
  const user = await db.user.findUnique({
    where: { id: parseInt(id) }
  });
  return user;
};

export default function Index() {
  const user = useLoaderData<LoaderData>();
  return (
    <div>
      <div>name: {user.name}</div>
      <div>id: {user.id}</div>
      <div>age: {user.age}</div>
    </div>
  );
}
