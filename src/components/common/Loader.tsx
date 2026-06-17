interface LoaderProps {
  text?: string;
}

export function Loader({ text = "Загрузка..." }: LoaderProps) {
  return <div className="loader">{text}</div>;
}
