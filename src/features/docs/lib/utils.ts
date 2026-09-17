export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getHeadingText(children: unknown): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children
      .map((child) => getHeadingText(child))
      .filter(Boolean)
      .join("");
  }

  if (
    typeof children === "object" &&
    children !== null &&
    "props" in children
  ) {
    const props = children.props as {
      children?: unknown;
    };

    return getHeadingText(props.children);
  }

  return "";
}
