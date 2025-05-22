import { useFetcher } from "react-router";
import Loading from "./Loading";
import { Alert, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AuthForm({ login }: { login?: boolean }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action={login ? "/sign-in" : "/sign-up"}>
      {fetcher.state === "submitting" && <Loading />}
      {fetcher?.data?.message && (
        <Alert variant="destructive">
          <AlertTitle>{fetcher?.data?.message}</AlertTitle>
        </Alert>
      )}

      <fieldset className="space-y-1">
        <Label htmlFor="title">Your name</Label>
        <Input
          placeholder="Enter name"
          className="dark:bg-dark dark:text-white"
          type="text"
          name="name"
          id="name"
        />
      </fieldset>
      <div className="!mt-8">
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </div>
    </fetcher.Form>
  );
}
