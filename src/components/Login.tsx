import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/warcraftcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/warcraftcn/card";
import { Input } from "@/components/ui/warcraftcn/input";
import { usePlayerStore } from "@/store/usePlayerStore";

export function Login() {
  const login = usePlayerStore((s) => s.login);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!login(name)) setError(true);
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="fantasy text-2xl leading-tight">
            Scouts of Lost Pine Island
          </CardTitle>
          <CardDescription>
            Enter your name to open your scout sheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(false);
              }}
              placeholder="Your first name"
              aria-label="Your first name"
              autoCapitalize="words"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full"
            />
            {error && (
              <p className="text-destructive text-sm" role="alert">
                Hmm, no scout by that name — try your first name.
              </p>
            )}
            <Button type="submit" className="w-full">
              Enter Camp
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
