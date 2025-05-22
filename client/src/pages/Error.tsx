import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Error() {
  return (
    <section className="flex items-center min-h-screen p-16">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-gray-600">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl dark:text-white">
            Sorry, we couldn&apos;t find this page.
          </p>
          <p className="mt-4 mb-8 text-gray-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to="/" rel="noopener noreferrer" replace={true}>
            <Button>Back to homepage</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
