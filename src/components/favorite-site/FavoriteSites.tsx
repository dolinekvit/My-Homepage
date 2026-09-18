import { useSettings } from "@/lib/useSettings";
import { AddFavoriteButton, FavoriteSite } from "./FavoriteSite";

export function FavoriteSites() {
  const { settings } = useSettings();

  return (
    <nav
      aria-label="Favorite sites"
      className="flex flex-wrap items-start justify-center gap-x-8 gap-y-7"
    >
      {settings.favoriteSites.map((props) => (
        <FavoriteSite key={props.url} {...props} />
      ))}
      <AddFavoriteButton />
    </nav>
  );
}
