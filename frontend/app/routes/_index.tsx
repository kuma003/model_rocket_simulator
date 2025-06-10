import Top from "~/components/Top";
import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => [
  { title: "Model Rocket Simulator" },
  { name: "description", content: "model rocket simulator" },
];


export default function Home() {
  return <Top/>;
}
