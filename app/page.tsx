import { useLocale } from "next-intl";
import { redirect } from "next/dist/client/components/redirect";

export default function Home() {
  redirect(useLocale())
}
