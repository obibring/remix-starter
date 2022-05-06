import db from "~/lib/db.server";

import { User } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

type LoaderData = {
  filters: {
    name?: string | undefined;
  };
  users: Array<User>;
};

export const loader: LoaderFunction = async (args) => {
  const searchParams = new URL(args.request.url).searchParams;
  const name = searchParams.get("name");
  const where =
    typeof name === "string" && name.trim().length > 0
      ? {
          name: name
        }
      : undefined;

  const users = await db.user.findMany({
    where
  });

  const loaderData: LoaderData = {
    users,
    filters: {
      name: searchParams.get("name")
    }
  };
  return loaderData;
};

export const action: ActionFunction = async (args) => {
  const formData = await args.request.formData();
  const userData = Object.fromEntries(formData.entries());
  await db.user.create({
    data: {
      name: userData.name as any,
      age: "age" in userData ? parseInt(userData.age as any) : undefined
    }
  });
  return redirect("/");
};

export default function Index() {
  const { users, filters } = useLoaderData<LoaderData>();
  return (
    <div>
      <div className={"bg-gray-100 p-5"}>
        <Form method="get">
          <input
            name="name"
            defaultValue={filters.name}
            placeholder="Filter users by name"
          />
          <button type="submit">Show Matching Users</button>
        </Form>
      </div>
      {users.map((user, i) => (
        <Link
          prefetch="render"
          className={"text-blue-500 ml-5 hover:underline"}
          to={`/user/${user.id}`}
          key={String(i)}
        >
          {user.name}
        </Link>
      ))}
    </div>
  );
}
