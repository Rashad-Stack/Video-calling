import useContext from "@/hooks/useContext";

export default function Home() {
  const { activeUsers } = useContext();

  console.log("activeUsers", activeUsers);
  return (
    <section>
      <div className="container mx-lg:max-w-6xl mx-auto py-4">
        <h1>Home</h1>
      </div>
    </section>
  );
}
