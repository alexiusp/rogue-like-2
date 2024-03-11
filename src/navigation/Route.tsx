import { useUnit } from "effector-react";
import { PropsWithChildren } from "react";
import { $route } from "./state";

interface IRouteProps extends PropsWithChildren {
  route: string;
}

export default function Route({ route, children }: IRouteProps) {
  const currentRoute = useUnit($route);
  if (currentRoute !== route) {
    return null;
  }
  return children;
}
