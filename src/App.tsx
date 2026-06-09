import { Login } from "@/components/Login";
import { SheetScreen } from "@/components/sheet/SheetScreen";
import { usePlayerStore } from "@/store/usePlayerStore";

export function App() {
  const activeCharacterId = usePlayerStore((s) => s.activeCharacterId);
  return activeCharacterId ? <SheetScreen /> : <Login />;
}
