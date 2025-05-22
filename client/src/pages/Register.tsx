import AuthForm from "@/components/AuthForm";

export default function Register() {
  return (
    <section>
      <div className="container mx-lg:max-w-6xl mx-auto py-4">
        <h1>Register</h1>

        <AuthForm login={false} />
      </div>
    </section>
  );
}
