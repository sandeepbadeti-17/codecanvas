import { prisma } from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();
  console.log(users);
  return (
    <>
      <h1>All Users</h1>
      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      ))}
    </>
  );
}
