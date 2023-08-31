export function buildRoutePath(path) {
  const routeParamaterRegex = /:([a-zA-Z]+)/g;
  const pathWithParams = path.replaceAll(
    routeParamaterRegex,
    "(?<$1>[a-z0-9-_]+)"
  );

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}
