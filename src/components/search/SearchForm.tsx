interface SearchFormProps {
  name: string;
  tag: string;
  onNameChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function SearchForm({
  name,
  tag,
  onNameChange,
  onTagChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <div className="search-form__fields">
        <input
          type="text"
          placeholder="Имя игрока"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="search-form__input"
        />
        <span className="search-form__separator">#</span>
        <input
          type="text"
          placeholder="Тег"
          value={tag}
          onChange={(event) => onTagChange(event.target.value)}
          className="search-form__input search-form__input--tag"
        />
      </div>
      <button type="submit" className="search-form__button">
        Найти
      </button>
    </form>
  );
}
