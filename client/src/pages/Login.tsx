import AuthForm from "@/components/AuthForm";

export default function Login() {
  return (
    <section>
      <div className="container mx-lg:max-w-6xl mx-auto py-4">
        <h1>login</h1>

        <AuthForm login={true} />
      </div>
    </section>
  );
}
