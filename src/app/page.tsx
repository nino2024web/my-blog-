// src/app/page.tsx
import { permanentRedirect } from "next/navigation";

export default function Home() {
  permanentRedirect("/blog");
}
