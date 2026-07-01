import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import History from "@/components/History/History";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: history } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false });

  return <History history={history} />;
}
