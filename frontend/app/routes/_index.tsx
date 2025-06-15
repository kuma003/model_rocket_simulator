import { Top } from "~/components/Top";
import type { Route } from "./+types/_index";
import { useLocation } from "react-router";

export const meta: Route.MetaFunction = () => [
  { title: "Model Rocket Simulator" },
  { name: "description", content: "model rocket simulator" },
];

export default function Home() {
  const location = useLocation();
  
  return <Top />;
}
